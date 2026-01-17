"use client";

import { FormProvider } from "react-hook-form";
import INTERESTS from "@/data/interests.json";
import {
  useTravelPreferencesForm,
  InterestsData,
} from "@/app/profile/travel-preferences/_hooks/useTravelPreferencesForm";
import PreferencesHeader from "@/app/profile/travel-preferences/components/PreferencesHeader";
import SelectedPreferencesList from "@/app/profile/travel-preferences/components/SelectedPreferencesList";
import CategorySection from "@/app/profile/travel-preferences/components/CategorySection";

export type Category = { id: string; title: string };
// Removed unused types that conflicted with new structure

const INTERESTS_DATA = INTERESTS as unknown as InterestsData;
const CATEGORY_KEYS = Object.keys(INTERESTS_DATA);

/* -------------------- PAGE -------------------- */

export default function TravelPreferencesPage() {
  const onSubmit = () => {
    // console.log("travel preferences submitted");
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
            {CATEGORY_KEYS.map((key) => {
              const categoryData = INTERESTS_DATA[key];
              if (!categoryData) return null;

              const category: Category = { id: key, title: categoryData.label };
              const interests = categoryData.items;
              const selectedIds = preferences[key] ?? [];

              return (
                <CategorySection
                  key={key}
                  category={category}
                  interests={interests}
                  selectedIds={selectedIds}
                  isActive={activeCategoryId === key}
                  onToggleCategory={() => toggleCategory(key)}
                  onToggleInterest={(interestId) =>
                    toggleInterest(key, interestId)
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
/*
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
*/
