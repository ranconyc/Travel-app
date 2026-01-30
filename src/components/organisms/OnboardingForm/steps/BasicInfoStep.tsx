"use client";

import React, { useRef } from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { OnboardingIdentityFormValues } from "@/domain/user/onboarding.schema";
import AvatarUpload from "@/components/molecules/AvatarUpload";
import Input from "@/components/atoms/Input";
import { Autocomplete } from "@/components/molecules/Autocomplete";
import { searchCityAction } from "@/domain/city/city.actions";
import { CitySearchResult } from "@/domain/city/city.schema";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import { SelectionCard } from "@/components/atoms/SelectionCard";
import Button from "@/components/atoms/Button";
import { OnboardingFooter } from "../OnboardingFooter";

interface BasicInfoStepProps {
  form: UseFormReturn<OnboardingIdentityFormValues>;
  avatarPreview: string | null;
  onAvatarSelect: (file: File, preview: string) => void;
  onNext: (goComplete?: boolean) => void;
  isSubmitting: boolean;
}

export function BasicInfoStep({
  form,
  avatarPreview,
  onAvatarSelect,
  onNext,
  isSubmitting,
}: BasicInfoStepProps) {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  console.log("[BasicInfoStep] Component rendered");

  const fullNameValue = watch("fullName");
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (
    part: "month" | "day" | "year",
    val: string,
    nextRef?: React.RefObject<HTMLInputElement | null>,
  ) => {
    if (val && !/^\d*$/.test(val)) return;
    setValue(`birthday.${part}`, val, { shouldValidate: true });
    if (part !== "year" && val.length === 2 && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  const birthdayError =
    errors.birthday?.month?.message ||
    errors.birthday?.day?.message ||
    errors.birthday?.year?.message;

  const genderValue = watch("gender");

  return (
    <div className="space-y-2">
      <div className="text-center mb-8">
        <h2 className="text-h3 text-txt-main mb-2">
          Tell us more about yourself
        </h2>
        <p className="text-p text-txt-sec">
          Help us personalize your experience
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <AvatarUpload
          src={avatarPreview}
          onSelect={onAvatarSelect}
          initials={fullNameValue
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")}
        />
      </div>

      <Input
        label="What is your full name?"
        placeholder="e.g., Christopher Columbus"
        error={errors.fullName?.message}
        {...register("fullName")}
      />

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
                console.log("[Autocomplete] loadOptions called with:", q);
                const res = await searchCityAction({ query: q });
                console.log("[Autocomplete] searchCityAction result:", res);
                const mapped =
                  res?.success && res.data
                    ? res.data.map((c) => ({
                        ...c,
                        subtitle: c.subtitle ?? undefined,
                      }))
                    : [];
                console.log("[Autocomplete] mapped options:", mapped);
                return mapped;
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
                });
              }}
              error={errors.location?.name?.message}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="birthday-month"
          className="text-sm font-semibold capitalize text-txt-main"
        >
          When were you born?
        </label>
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              id="birthday-month"
              aria-label="Month"
              {...register("birthday.month")}
              onChange={(e) => {
                register("birthday.month").onChange(e);
                handleDateChange("month", e.target.value, dayRef);
              }}
              ref={(e: any) => {
                register("birthday.month").ref(e);
                if (monthRef) (monthRef as any).current = e;
              }}
              placeholder="MM"
              variant={birthdayError ? "error" : "default"}
              maxLength={2}
              className="text-center"
            />
          </div>
          <div className="flex-1">
            <Input
              aria-label="Day"
              {...register("birthday.day")}
              onChange={(e) => {
                register("birthday.day").onChange(e);
                handleDateChange("day", e.target.value, yearRef);
              }}
              ref={(e: any) => {
                register("birthday.day").ref(e);
                if (dayRef) (dayRef as any).current = e;
              }}
              placeholder="DD"
              variant={birthdayError ? "error" : "default"}
              maxLength={2}
              className="text-center"
            />
          </div>
          <div className="flex-2">
            <Input
              aria-label="Year"
              {...register("birthday.year")}
              onChange={(e) => {
                register("birthday.year").onChange(e);
                handleDateChange("year", e.target.value);
              }}
              ref={(e: any) => {
                register("birthday.year").ref(e);
                if (yearRef) (yearRef as any).current = e;
              }}
              placeholder="YYYY"
              variant={birthdayError ? "error" : "default"}
              maxLength={4}
              className="text-center"
            />
          </div>
        </div>
        {birthdayError && (
          <ErrorMessage id="birthday-error" error={String(birthdayError)} />
        )}
      </div>

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

      <OnboardingFooter>
        <div className="flex flex-col gap-3 w-full">
          <Button
            type="button"
            fullWidth
            loading={isSubmitting}
            onClick={() => onNext(false)}
          >
            Tell us more
          </Button>
          <Button
            type="button"
            variant="ghost"
            fullWidth
            onClick={() => onNext(true)}
          >
            Save & Finish
          </Button>
        </div>
      </OnboardingFooter>
    </div>
  );
}
