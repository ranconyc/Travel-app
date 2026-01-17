"use client";

import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import INTERESTS from "@/data/interests.json";

export type InterestItem = { id: string; label: string };
export type CategoryData = { id: string; label: string; items: InterestItem[] };
export type InterestsData = Record<string, CategoryData>;

const INTERESTS_DATA = INTERESTS as unknown as InterestsData;
const CATEGORY_KEYS = Object.keys(INTERESTS_DATA);

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
      CATEGORY_KEYS.flatMap((key) => {
        const categoryCallback = INTERESTS_DATA[key];
        // Ensure category exists
        if (!categoryCallback) return [];

        const selectedIds = preferences[key] ?? [];

        return selectedIds
          .map((id) => {
            const item = categoryCallback.items.find((i) => i.id === id);
            if (!item) return null;
            return {
              categoryId: key,
              categoryTitle: categoryCallback.label,
              interestId: id,
              label: item.label,
            };
          })
          .filter(Boolean) as SelectedPreference[];
      }),
    [preferences],
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
