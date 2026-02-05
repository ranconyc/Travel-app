import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { OnboardingIdentityFormValues } from "@/domain/user/onboarding.schema";
import AvatarUpload from "@/components/molecules/AvatarUpload";
import Input from "@/components/atoms/Input";
import { Autocomplete } from "@/components/molecules/Autocomplete";
import { searchCityAction } from "@/domain/city/city.actions";
import { CitySearchResult } from "@/domain/city/city.schema";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import { SelectionCard } from "@/components/molecules/SelectionCard";
import Typography from "@/components/atoms/Typography";
import BirthdayInput from "@/components/molecules/BirthdayInput";

interface BasicInfoStepProps {
  form: UseFormReturn<OnboardingIdentityFormValues>;
  avatarPreview: string | null;
  onAvatarSelect: (file: File, preview: string) => void;
}

export function BasicInfoStep({
  form,
  avatarPreview,
  onAvatarSelect,
}: BasicInfoStepProps) {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const firstNameValue = watch("firstName");
  const lastNameValue = watch("lastName");
  const genderValue = watch("gender");

  const birthdayError =
    errors.birthday?.month?.message ||
    errors.birthday?.day?.message ||
    errors.birthday?.year?.message;

  // Generate initials from firstName + lastName
  const initials = [firstNameValue?.[0], lastNameValue?.[0]]
    .filter(Boolean)
    .join("");

  return (
    <div className="space-y-2">
      <div className="text-center">
        <Typography variant="h3" color="main" className="mb-2">
          Tell us more about yourself
        </Typography>
        <Typography variant="p" color="sec">
          Help us personalize your experience
        </Typography>
      </div>

      <div className="flex justify-center mb-6">
        <AvatarUpload
          src={avatarPreview}
          onSelect={onAvatarSelect}
          initials={initials}
        />
      </div>

      <div className="flex gap-3">
        <Input
          id="first-name"
          label="First name"
          placeholder="e.g., Christopher"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          id="last-name"
          label="Last name (optional)"
          placeholder="e.g., Columbus"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

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
                  countryCode: cityOpt?.countryCode,
                  stateCode: cityOpt?.stateCode,
                  stateType: (cityOpt as any)?.stateType, // Cast until schema update propagates
                  coords,
                });
              }}
              error={errors.location?.name?.message}
            />
          )}
        />
      </div>

      <BirthdayInput
        monthRegistration={register("birthday.month")}
        dayRegistration={register("birthday.day")}
        yearRegistration={register("birthday.year")}
        error={birthdayError}
      />

      <div className="space-y-3">
        <span className="text-sm font-semibold capitalize text-txt-main">
          Gender
        </span>
        <div className="flex flex-row gap-2">
          {(["MALE", "FEMALE", "NON_BINARY"] as const).map((g) => (
            <SelectionCard
              key={g}
              type="radio"
              label={g.charAt(0) + g.slice(1).toLowerCase().replace("_", "-")}
              isSelected={genderValue === g}
              onChange={() => setValue("gender", g, { shouldValidate: true })}
              className="w-full flex-1"
            />
          ))}
        </div>
        <ErrorMessage
          id="gender-error"
          error={errors.gender?.message}
          className="mt-1"
        />
      </div>
    </div>
  );
}
