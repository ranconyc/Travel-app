"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { OnboardingIdentityFormValues } from "@/domain/user/onboarding.schema";

import { SelectionCard } from "@/components/molecules/SelectionCard";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import travelStyles from "@/data/travelStyles.json";
import { ICON_MAP } from "../onboarding.config";
import { Map as MapIcon } from "lucide-react";

interface StyleStepProps {
  form: UseFormReturn<OnboardingIdentityFormValues>;
}

export function StyleStep({ form }: StyleStepProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;
  const travelStylesValue = watch("travelStyles");

  return (
    <div className="space-y-3">
      <div className="mb-6">
        <h2 className="text-h3 font-bold text-txt-main mb-2">
          Which travel Style feels most like you?
        </h2>
        <p className="text-p text-txt-sec">
          Select the option that matches you the most
        </p>
      </div>
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
    </div>
  );
}
