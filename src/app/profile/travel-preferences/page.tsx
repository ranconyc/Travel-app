"use client";

import { FormProvider } from "react-hook-form";
import Button from "@/app/component/common/Button";
import Logo from "@/app/component/common/Logo";
import CATEGORIES from "@/data/categories.json";
import INTERESTS from "@/data/interests.json";
import {
  useTravelPreferencesForm,
  type FormValues,
  type SelectedPreference,
} from "./_hooks/useTravelPreferencesForm";
import PreferencesHeader from "./components/PreferencesHeader";
import SelectedPreferencesList from "./components/SelectedPreferencesList";
import CategorySection from "./components/CategorySection";

export type Category = { id: string; title: string };
export type InterestsByCategory = Record<string, string[]>;
export type CategoryId = string;
export type Interest = string;

const INTERESTS_BY_CATEGORY = INTERESTS as InterestsByCategory;

/* -------------------- PAGE -------------------- */

export default function TravelPreferencesPage() {
  const onSubmit = (data: FormValues) => {
    // console.log("travel preferences submitted", data.preferences);
    // TODO: send to API
  };

  const {
    methods,
    handleFormSubmit,
    activeCategoryId,
    toggleCategory,
    toggleInterest,
    selectedItems,
    selectedCount,
    preferences,
  } = useTravelPreferencesForm(onSubmit);

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen flex flex-col bg-[#f7f7f2]">
        <PreferencesHeader selectedCount={selectedCount} />

        <main className="flex-1">
          <SelectedPreferencesList
            items={selectedItems}
            onRemove={toggleInterest}
          />

          <form
            onSubmit={handleFormSubmit}
            className="relative flex flex-col gap-4 px-4 pb-28 pt-4"
          >
            {CATEGORIES.map((category: Category) => {
              const interests =
                INTERESTS_BY_CATEGORY[category.id as CategoryId] ?? [];
              const selectedIds = preferences[category.id] ?? [];

              return (
                <CategorySection
                  key={category.id}
                  category={category}
                  interests={interests}
                  selectedIds={selectedIds}
                  isActive={activeCategoryId === category.id}
                  onToggleCategory={() => toggleCategory(category.id)}
                  onToggleInterest={(interestId) =>
                    toggleInterest(category.id, interestId)
                  }
                />
              );
            })}

            {/* Sticky footer example – enable when needed */}
            {/* <FooterActions canContinue={selectedCount > 0} /> */}
          </form>
        </main>
      </div>
    </FormProvider>
  );
}

/* -------------------- COMPONENTS -------------------- */

// Optional sticky footer if/when you need navigation
type FooterActionsProps = {
  canContinue: boolean;
};

function FooterActions({ canContinue }: FooterActionsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-3 flex justify-between">
      <Button type="button" variant="outline">
        Back
      </Button>
      <Button type="submit" disabled={!canContinue}>
        Next
      </Button>
    </div>
  );
}
