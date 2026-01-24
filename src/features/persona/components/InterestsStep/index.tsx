"use client";

import SelectedItem from "@/components/molecules/SelectedItem";
import { useMemo, useState } from "react";
import interests from "@/data/interests.json";
import { ChevronRight } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { PersonaFormValues } from "@/features/persona/types/form";
import InterestsModal from "@/features/persona/components/InterestsModal";

// CATEGORIES
type InterestItem = { id: string; label: string };
type Category = { id: string; label: string; items: InterestItem[] };
type InterestsData = Record<string, Category>;

const interestsData: InterestsData = interests as unknown as InterestsData;
const categoryKeys = Object.keys(interestsData);

// CategoryRow Component
interface CategoryRowProps {
  title: string;
  selectedCount: number;
  onClick: () => void;
}

export const CategoryRow = ({
  title,
  selectedCount,
  onClick,
}: CategoryRowProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left border-2 border-surface hover:border-brand transition-colors rounded-xl px-3 py-2 flex justify-between items-center group"
    >
      <div>
        <h1 className="font-semibold">{title}</h1>
        <p
          className={`text-xs ${
            selectedCount > 0 ? "text-brand" : "text-secondary"
          }`}
        >
          {selectedCount > 0 ? `${selectedCount} selected` : "Tap to select"}
        </p>
      </div>

      <ChevronRight
        className="text-secondary group-hover:text-brand transition-colors"
        size={24}
      />
    </button>
  );
};

// Main InterestsStep Component
export default function InterestsStep() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(
    null,
  );

  const { watch, setValue } = useFormContext<PersonaFormValues>();
  const selectedInterests = watch("interests");

  // Helper to get label by ID
  const getLabelById = (id: string) => {
    for (const cat of Object.values(interestsData)) {
      const item = cat.items.find((i) => i.id === id);
      if (item) return item.label;
    }
    return id;
  };

  const handleOptionToggle = (optionId: string) => {
    const isSelected = selectedInterests.includes(optionId);
    if (isSelected) {
      setValue(
        "interests",
        selectedInterests.filter((i) => i !== optionId),
      );
    } else {
      setValue("interests", [...selectedInterests, optionId]);
    }
  };

  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategoryKey(categoryKey);
    setShowModal(true);
  };

  // Memoize category counts for performance
  const categoryCounts = useMemo(() => {
    return categoryKeys.reduce(
      (acc, key) => {
        const category = interestsData[key];
        // Count how many items in this category are currently selected (by ID)
        const count = category.items.filter((item) =>
          selectedInterests.includes(item.id),
        ).length;
        acc[key] = count;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [selectedInterests]);

  return (
    <div className="mb-4">
      {/* Show selected interests */}
      {selectedInterests.length > 0 && (
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-4">You&apos;re into:</h1>
          <ul className="flex flex-wrap gap-2">
            {selectedInterests.map((interestId) => (
              <SelectedItem
                key={interestId}
                item={getLabelById(interestId)}
                onClick={() => handleOptionToggle(interestId)}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Show categories */}
      <div className="grid grid-cols-1 gap-2">
        <h2 className="text-xs font-bold text-secondary">
          Select all that interest you
        </h2>
        {categoryKeys.map((key) => (
          <CategoryRow
            key={key}
            title={interestsData[key].label}
            selectedCount={categoryCounts[key]}
            onClick={() => handleCategoryClick(key)}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedCategoryKey && (
        <InterestsModal
          categoryKey={selectedCategoryKey}
          onClose={() => setShowModal(false)}
          selectedInterests={selectedInterests}
          onOptionToggle={handleOptionToggle}
        />
      )}
    </div>
  );
}
