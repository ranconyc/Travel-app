"use client";

import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import CATEGORIES from "@/data/categories.json";
import INTERESTS from "@/data/interests.json";

const INTERESTS_BY_CATEGORY = INTERESTS as InterestsByCategory;

type Category = (typeof CATEGORIES)[number];
type InterestsByCategory = typeof INTERESTS;
type CategoryId = keyof InterestsByCategory;
type Interest = InterestsByCategory[CategoryId][number];

export type FormValues = {
  preferences: Record<string, string[]>;
};

export type SelectedPreference = {
  categoryId: string;
  categoryTitle: string;
  interestId: string;
  label: string;
};

export function useTravelPreferencesForm(onSubmit?: SubmitHandler<FormValues>) {
  const methods = useForm<FormValues>({
    defaultValues: {
      preferences: {},
    },
  });

  const { handleSubmit, watch, setValue } = methods;
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const preferences = watch("preferences") ?? {};

  const toggleCategory = (id: string) => {
    setActiveCategoryId((prev) => (prev === id ? null : id));
  };

  const toggleInterest = (categoryId: string, interestId: string) => {
    const current = preferences[categoryId] ?? [];
    const exists = current.includes(interestId);
    const next = exists
      ? current.filter((id) => id !== interestId)
      : [...current, interestId];

    setValue(`preferences.${categoryId}` as const, next, {
      shouldDirty: true,
    });
  };

  const selectedItems: SelectedPreference[] = useMemo(
    () =>
      CATEGORIES.flatMap((category: Category) => {
        const categoryInterests =
          INTERESTS_BY_CATEGORY[category.id as CategoryId] ?? [];
        const selectedIds = preferences[category.id] ?? [];

        return selectedIds
          .map((id) => {
            const interest = categoryInterests.find((i) => i.id === id);
            if (!interest) return null;
            return {
              categoryId: category.id,
              categoryTitle: category.title,
              interestId: id,
              label: interest.label,
            };
          })
          .filter(Boolean) as SelectedPreference[];
      }),
    [preferences]
  );

  const selectedCount = selectedItems.length;

  return {
    methods,
    handleSubmit,
    handleFormSubmit: onSubmit ? handleSubmit(onSubmit) : undefined,
    activeCategoryId,
    toggleCategory,
    toggleInterest,
    selectedItems,
    selectedCount,
    preferences,
  };
}
