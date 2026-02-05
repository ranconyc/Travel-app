"use client";

import { UseFormReturn } from "react-hook-form";
import { OnboardingIdentityFormValues } from "@/domain/user/onboarding.schema";
import { SelectionCard } from "@/components/molecules/SelectionCard";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import dailyRhythms from "@/data/dailyRhythms.json";
import { ICON_MAP } from "../onboarding.config";
import { Sun } from "lucide-react";

interface RhythmStepProps {
  form: UseFormReturn<OnboardingIdentityFormValues>;
}

export function RhythmStep({ form }: RhythmStepProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;
  const rhythmValue = watch("rhythm");

  return (
    <div className="">
      <div className="mb-6">
        <h2 className="text-h3 font-bold text-txt-main mb-2">
          What is your travel Rhythm?
        </h2>
        <p className="text-p text-txt-sec">
          Select the option that matches you the most
        </p>
      </div>
      <div className="space-y-3">
        {dailyRhythms.map((item) => {
          const Icon = ICON_MAP[item.icon] || Sun;
          return (
            <SelectionCard
              key={item.id}
              type="radio"
              label={item.label}
              description={item.description}
              icon={<Icon size={24} />}
              isSelected={rhythmValue === item.id}
              onChange={() =>
                setValue("rhythm", item.id, { shouldValidate: true })
              }
              className="w-full"
            />
          );
        })}
        <ErrorMessage id="rhythm-error" error={errors.rhythm?.message} />
      </div>
    </div>
  );
}
