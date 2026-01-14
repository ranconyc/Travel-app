"use client";

import { Button, SelectionCard, SelectInterests } from "@/app/mode/page";
import { useState } from "react";
import interests from "@/data/interests.json";
import { ChevronRight, X } from "lucide-react";
import { useFormContext } from "react-hook-form";

// CATEGORIES
const categories: { [key: string]: string[] } = interests;

const categoryNames = Object.keys(categories);

// components
// CategoryRow

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
      <div className="">
        <h1 className="">{title}</h1>
        {/* check y isnt working */}
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

// Modal
// MODAL
const Modal = ({
  category = "Shopping",
  onClose,
  selectedInterests,
  onOptionToggle,
}: {
  category: string;
  onClose: () => void;
  selectedInterests: string[];
  onOptionToggle: (option: string) => void;
}) => {
  return (
    <div className="fixed inset-0 bg-blur flex items-end z-50 animate-fade-in">
      <div className="w-full h-fit max-h-[600px] bg-app-bg m-3 mb-4 px-3 py-6 rounded-4xl animate-slide-up">
        <div className="flex justify-end">
          <X className="cursor-pointer" size={20} onClick={onClose} />
        </div>
        <h1 className="text-xl font-bold mb-2">{category}</h1>
        <p className="mb-4 text-sm font-bold text-secondary">
          Select all that interest you
        </p>
        <div className="grid gap-2 h-fit  overflow-y-scroll">
          {categories[category].map((option) => (
            <SelectionCard
              key={option}
              id={option}
              label={option}
              isSelected={selectedInterests.includes(option)}
              onChange={() => onOptionToggle(option)}
            />
          ))}
        </div>
        <div className="mt-6">
          <Button className="w-full" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function StepOne() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { watch, setValue } = useFormContext();
  const selectedInterests = watch("interests");

  const handleOptionToggle = (option: string) => {
    const isSelected = selectedInterests.includes(option);
    if (isSelected) {
      setValue(
        "interests",
        selectedInterests.filter((i: string) => i !== option)
      );
    } else {
      setValue("interests", [...selectedInterests, option]);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const getSelectedCountForCategory = (category: string) => {
    const options = categories[category];
    return selectedInterests.filter((interest: string) =>
      options.includes(interest)
    ).length;
  };

  return (
    <div className="mb-4">
      {/* show selected interests */}
      {selectedInterests?.length > 0 && (
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-4">You&apos;re into:</h1>
          <ul className="flex flex-wrap gap-2">
            {selectedInterests?.map((interest: string) => (
              <SelectInterests
                key={interest}
                item={interest}
                onClick={() => handleOptionToggle(interest)}
              />
            ))}
          </ul>
        </div>
      )}

      {/* show categories */}
      <div className="grid grid-cols-1 gap-2">
        <h2 className="text-xs font-bold text-secondary">
          Select all that interest you
        </h2>
        {categoryNames.map((category) => (
          <CategoryRow
            key={category}
            title={category}
            selectedCount={getSelectedCountForCategory(category)}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </div>

      {/* modal */}
      {showModal && (
        <Modal
          category={selectedCategory || ""}
          onClose={() => setShowModal(false)}
          selectedInterests={selectedInterests}
          onOptionToggle={handleOptionToggle}
        />
      )}
    </div>
  );
}
