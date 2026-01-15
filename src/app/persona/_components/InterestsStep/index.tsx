"use client";

import { SelectedItem } from "@/app/mode/page";
import { useMemo, useState } from "react";
import interests from "@/data/interests.json";
import { ChevronRight } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { PersonaFormValues } from "../../_types/form";
import InterestsModal from "../InterestsModal";

// CATEGORIES
const categories: { [key: string]: string[] } = interests;
const categoryNames = Object.keys(categories);

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
        <h1>{title}</h1>
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { watch, setValue } = useFormContext<PersonaFormValues>();
  const selectedInterests = watch("interests");

  const handleOptionToggle = (option: string) => {
    const isSelected = selectedInterests.includes(option);
    if (isSelected) {
      setValue(
        "interests",
        selectedInterests.filter((i) => i !== option)
      );
    } else {
      setValue("interests", [...selectedInterests, option]);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  // Memoize category counts for performance
  const categoryCounts = useMemo(() => {
    return categoryNames.reduce((acc, category) => {
      const options = categories[category];
      acc[category] = selectedInterests.filter((interest) =>
        options.includes(interest)
      ).length;
      return acc;
    }, {} as Record<string, number>);
  }, [selectedInterests]);

  return (
    <div className="mb-4">
      {/* Show selected interests */}
      {selectedInterests.length > 0 && (
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-4">You&apos;re into:</h1>
          <ul className="flex flex-wrap gap-2">
            {selectedInterests.map((interest) => (
              <SelectedItem
                key={interest}
                item={interest}
                onClick={() => handleOptionToggle(interest)}
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
        {categoryNames.map((category) => (
          <CategoryRow
            key={category}
            title={category}
            selectedCount={categoryCounts[category]}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedCategory && (
        <InterestsModal
          category={selectedCategory}
          onClose={() => setShowModal(false)}
          selectedInterests={selectedInterests}
          onOptionToggle={handleOptionToggle}
        />
      )}
    </div>
  );
}
