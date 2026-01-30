"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { OnboardingIdentityFormValues } from "@/domain/user/onboarding.schema";
import { WizardStepHeader } from "@/components/molecules/WizardStepHeader";
import { SelectionCard } from "@/components/atoms/SelectionCard";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import Button from "@/components/atoms/Button";
import travelStyles from "@/data/travelStyles.json";
import { ICON_MAP } from "../onboarding.config";
import { Map as MapIcon } from "lucide-react";
import { OnboardingFooter } from "../OnboardingFooter";

interface StyleStepProps {
  form: UseFormReturn<OnboardingIdentityFormValues>;
  onBack: () => void;
  onNext: (goComplete?: boolean) => void;
}

export function StyleStep({ form, onBack, onNext }: StyleStepProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;
  const travelStylesValue = watch("travelStyles");

  return (
    <div className="space-y-3">
      <WizardStepHeader
        title="Which travel Style feels most like you?"
        description="Select the option that matches you the most"
        onBack={onBack}
      />
      <div className="space-y-3">
        {travelStyles.map((item) => {
          const Icon = ICON_MAP[item.icon] || MapIcon;
          return (
            <SelectionCard
              key={item.id}
              type="radio"
              label={item.label}
              description={item.description}
              icon={<Icon size={24} />}
              isSelected={travelStylesValue === item.id}
              onChange={() =>
                setValue("travelStyles", item.id, { shouldValidate: true })
              }
              className="w-full"
            />
          );
        })}
        <ErrorMessage
          id="travel-styles-error"
          error={errors.travelStyles?.message}
        />
      </div>
      <OnboardingFooter>
        <Button
          type="button"
          variant="ghost"
          className="flex-1"
          onClick={() => onNext(true)}
        >
          Skip
        </Button>
        <Button type="button" className="flex-1" onClick={() => onNext(true)}>
          Finish
        </Button>
      </OnboardingFooter>
    </div>
  );
}
