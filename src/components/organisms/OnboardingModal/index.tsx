"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  onboardingIdentitySchema,
  OnboardingIdentityFormValues,
} from "@/domain/user/onboarding.schema";
import { useCompleteIdentityOnboarding } from "@/domain/user/user.hooks";
import { useUser } from "@/app/providers/UserProvider";
import { Autocomplete } from "@/components/molecules/Autocomplete";
import Typography from "@/components/atoms/Typography";
import { searchCityAction } from "@/domain/city/city.actions";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Modal from "@/components/molecules/Modal";
import AvatarUpload from "@/components/molecules/AvatarUpload";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import { toast } from "sonner";
import { CitySearchResult } from "@/domain/city/city.schema";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({
  isOpen,
  onClose,
}: OnboardingModalProps) {
  const user = useUser();
  const completeIdentityMutation = useCompleteIdentityOnboarding();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatarUrl || null,
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<OnboardingIdentityFormValues>({
    resolver: zodResolver(onboardingIdentitySchema),
    mode: "onChange",
    defaultValues: {
      fullName: user?.name || "",
      avatarUrl: user?.avatarUrl || "",
      birthday: {
        month: "",
        day: "",
        year: "",
      },
      // Zod Enum expects literals, but undefined for initial state is fine if optional,
      // but schema says gender is REQUIRED (GenderEnum).
      // User might be existing but have no gender set.
      gender: undefined,
      location: {
        name: "",
        placeId: undefined,
        coords: undefined,
      },
    },
  });

  // Date Refs for Auto-focus
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (data: OnboardingIdentityFormValues) => {
    try {
      await completeIdentityMutation.mutateAsync(data);
      toast.success("Profile updated!");
      onClose();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  const handleAvatarSelect = async (file: File, preview: string) => {
    setAvatarPreview(preview);
    // TODO: Upload logic. For now, we simulate success or expect user to override hook to upload.
    // Ideally: const url = await uploadFile(file); setValue("avatarUrl", url);
    // Since we don't have a ready `uploadFile` hook here, we'll placeholder.
    // Assuming backend might handle multipart in future or we need separate upload.
    // For now we assume if preview is blob, backend won't save it as persistent URL unless we upload.
    // I will mock this part or expect user to add upload logic.
    // But to prevent schema error if avatarUrl is empty and schema says optional, it's fine.
  };

  const handleDateChange = (
    part: "month" | "day" | "year",
    val: string,
    nextRef?: React.RefObject<HTMLInputElement | null>, // Fix: allow null in RefObject
  ) => {
    // Allow only numbers
    if (val && !/^\d*$/.test(val)) return;

    setValue(`birthday.${part}`, val, { shouldValidate: true });

    if (part !== "year" && val.length === 2 && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tell us more about yourself"
      showCloseButton={false}
      className="md:max-w-md"
    >
      <Typography variant="body" color="sec" className="text-center mb-6">
        Help us personalize your experience
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <AvatarUpload
            src={avatarPreview}
            onSelect={handleAvatarSelect}
            initials={watch("fullName")
              ?.split(" ")
              .map((n) => n[0])
              .join("")}
          />
        </div>

        {/* Full Name */}
        <Input
          label="What is your full name?"
          placeholder="e.g., Christopher Columbus"
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        {/* Location - Autocomplete */}
        <div className="space-y-2">
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                label="Where do you live?"
                name="location"
                placeholder="e.g., New York, NY"
                value={value?.name}
                loadOptions={async (q) => {
                  const res = await searchCityAction({ query: q });
                  return res?.success && res.data
                    ? res.data.map((c) => ({
                        ...c,
                        subtitle: c.subtitle ?? undefined,
                      }))
                    : [];
                }}
                onSelect={(val, option) => {
                  const cityOpt = option as CitySearchResult;
                  const coords =
                    cityOpt?.lat && cityOpt?.lng
                      ? {
                          type: "Point" as const,
                          coordinates: [cityOpt.lng, cityOpt.lat] as [
                            number,
                            number,
                          ],
                        }
                      : undefined;

                  onChange({
                    name: val,
                    placeId: cityOpt?.id,
                    coords,
                    // If it's external, we'll need to pass meta to completeProfile action later.
                    // But schema only has name/placeId/coords.
                    // We might need to extend schema or use hidden field.
                    // Actually, if we use findOrCreateCity in the completeProfile mutation,
                    // we can pass the meta.
                    // For now, let's just make sure name and coords are there.
                    _externalMeta:
                      cityOpt?.source === "external" ? cityOpt.meta : undefined,
                  });
                }}
                error={errors.location?.name?.message}
              />
            )}
          />
        </div>

        {/* Birthday */}
        {(() => {
          const birthdayError =
            errors.birthday?.month?.message ||
            errors.birthday?.day?.message ||
            errors.birthday?.year?.message;

          return (
            <div className="space-y-2">
              <Typography
                as="label"
                variant="label"
                weight="semibold"
                color="main"
                className="block mb-2"
              >
                When were you born?
              </Typography>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    {...(() => {
                      const { ref: rhfRef, ...rest } = register(
                        "birthday.month",
                        {
                          onChange: (e) =>
                            handleDateChange("month", e.target.value, dayRef),
                        },
                      );
                      return {
                        ...rest,
                        ref: (e: HTMLInputElement | null) => {
                          rhfRef(e);
                          if (monthRef)
                            (
                              monthRef as React.MutableRefObject<HTMLInputElement | null>
                            ).current = e;
                        },
                      };
                    })()}
                    placeholder="MM"
                    variant={birthdayError ? "error" : "default"}
                    maxLength={2}
                    className="text-center"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    {...(() => {
                      const { ref: rhfRef, ...rest } = register(
                        "birthday.day",
                        {
                          onChange: (e) =>
                            handleDateChange("day", e.target.value, yearRef),
                        },
                      );
                      return {
                        ...rest,
                        ref: (e: HTMLInputElement | null) => {
                          rhfRef(e);
                          if (dayRef)
                            (
                              dayRef as React.MutableRefObject<HTMLInputElement | null>
                            ).current = e;
                        },
                      };
                    })()}
                    placeholder="DD"
                    variant={birthdayError ? "error" : "default"}
                    maxLength={2}
                    className="text-center"
                  />
                </div>
                <div className="flex-2">
                  <Input
                    {...(() => {
                      const { ref: rhfRef, ...rest } = register(
                        "birthday.year",
                        {
                          onChange: (e) =>
                            handleDateChange("year", e.target.value),
                        },
                      );
                      return {
                        ...rest,
                        ref: (e: HTMLInputElement | null) => {
                          rhfRef(e);
                          if (yearRef)
                            (
                              yearRef as React.MutableRefObject<HTMLInputElement | null>
                            ).current = e;
                        },
                      };
                    })()}
                    placeholder="YYYY"
                    variant={birthdayError ? "error" : "default"}
                    maxLength={4}
                    className="text-center"
                  />
                </div>
              </div>
              {birthdayError && (
                <ErrorMessage
                  id="birthday-error"
                  error={String(birthdayError)}
                />
              )}
            </div>
          );
        })()}

        {/* Gender */}
        <div className="space-y-2">
          <Typography
            as="label"
            variant="label"
            weight="semibold"
            color="main"
            className="block mb-2"
          >
            Gender
          </Typography>
          <div className="flex gap-2">
            {(["MALE", "FEMALE", "NON_BINARY"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setValue("gender", g, { shouldValidate: true })}
                className={`flex-1 p-3 rounded-sm border transition-all text-sm font-medium ${
                  watch("gender") === g
                    ? "border-brand bg-brand/5 text-brand"
                    : "border-surface-secondary text-secondary hover:border-brand/50"
                }`}
              >
                {g.charAt(0) + g.slice(1).toLowerCase().replace("_", "-")}
              </button>
            ))}
          </div>
          {errors.gender && (
            <Typography variant="caption" color="error" className="mt-1">
              {errors.gender.message}
            </Typography>
          )}
        </div>

        <Button
          type="submit"
          fullWidth
          loading={isSubmitting}
          // disabled={!isValid} // Optional: let user click to see errors
          className="mt-8"
        >
          Save & Continue
        </Button>
      </form>
    </Modal>
  );
}
