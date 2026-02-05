"use client";

import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { OnboardingIdentityFormValues } from "@/domain/user/onboarding.schema";

import { SelectionCard } from "@/components/molecules/SelectionCard";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import Select from "@/components/atoms/Select";
import budgetOptions from "@/data/budget.json";
import currencies from "@/data/currencies.json";
import { ICON_MAP } from "../onboarding.config";
import { Wallet } from "lucide-react";

interface BudgetStepProps {
  form: UseFormReturn<OnboardingIdentityFormValues>;
}

export function BudgetStep({ form }: BudgetStepProps) {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const budgetValue = watch("budget");

  return (
    <div className="space-y-6">
      <div className="my-sm">
        <h2 className="text-h3 font-bold text-txt-main mb-2">
          What is your travel Budget?
        </h2>
        <p className="text-p text-txt-sec">
          Select the option that matches you the most
        </p>
      </div>
      <div className="space-y-3">
        {budgetOptions.map((item) => {
          const Icon = ICON_MAP[item.icon] || Wallet;
          return (
            <SelectionCard
              key={item.id}
              type="radio"
              label={item.label}
              description={item.description}
              icon={<Icon size={24} />}
              isSelected={budgetValue === item.id}
              onChange={() =>
                setValue("budget", item.id, { shouldValidate: true })
              }
              className="w-full"
            />
          );
        })}
        <ErrorMessage id="budget-error" error={errors.budget?.message} />
      </div>

      <div className="pt-4 border-t border-surface-secondary">
        <Controller
          control={control}
          name="currency"
          render={({ field }) => (
            <Select
              label="Currency"
              options={currencies.map((c) => ({
                value: c.code,
                label: `${c.code} - ${c.name}`,
              }))}
              {...field}
              error={errors.currency?.message}
            />
          )}
        />
      </div>
    </div>
  );
}
