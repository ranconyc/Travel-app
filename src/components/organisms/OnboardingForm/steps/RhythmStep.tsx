"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { OnboardingIdentityFormValues } from "@/domain/user/onboarding.schema";
import { WizardStepHeader } from "@/components/molecules/WizardStepHeader";
import { SelectionCard } from "@/components/atoms/SelectionCard";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import Button from "@/components/atoms/Button";
import dailyRhythms from "@/data/dailyRhythms.json";
import { ICON_MAP } from "../onboarding.config";
import { Sun } from "lucide-react";

interface RhythmStepProps {
  form: UseFormReturn<OnboardingIdentityFormValues>;
  onBack: () => void;
  onNext: (goComplete?: boolean) => void;
}

export function RhythmStep({ form, onBack, onNext }: RhythmStepProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;
  const rhythmValue = watch("rhythm");

  return (
    <div className="space-y-3">
      <WizardStepHeader
        title="What is your travel Rhythm?"
        description="Select the option that matches you the most"
        onBack={onBack}
      />
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
      <div className="flex gap-3 mt-8">
        <Button
          type="button"
          variant="ghost"
          className="flex-1"
          onClick={() => onNext(false)}
        >
          Skip
        </Button>
        <Button type="button" className="flex-2" onClick={() => onNext(false)}>
          Continue
        </Button>
      </div>
    </div>
  );
}
