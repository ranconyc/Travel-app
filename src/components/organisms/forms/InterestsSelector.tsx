"use client";

import SelectedItem from "@/components/molecules/SelectedItem";
import { useMemo, useState } from "react";
import interests from "@/data/interests.json";
import InterestsModal from "@/features/persona/components/InterestsModal";
import { CategoryRow } from "@/components/molecules/forms";

// CATEGORIES
type InterestItem = { id: string; label: string };
type Category = { id: string; label: string; items: InterestItem[] };
type InterestsData = Record<string, Category>;

const interestsData: InterestsData = interests as unknown as InterestsData;
const categoryKeys = Object.keys(interestsData);

interface InterestsSelectorProps {
  value: string[];
  onChange: (interests: string[]) => void;
  variant?: "full" | "compact";
}

/**
 * InterestsSelector - Pure, reusable interests selection component
 *
 * Decoupled from form context. Can be used in:
 * - PersonaForm (initial onboarding)
 * - Profile Edit page
 * - Standalone modals
 * - Any other context requiring interest selection
 *
 * @example
 * ```tsx
 * // In PersonaForm with React Hook Form
 * <InterestsSelector
 *   value={watch("interests")}
 *   onChange={(ids) => setValue("interests", ids)}
 * />
 *
 * // In Profile Edit
 * <InterestsSelector
 *   value={userInterests}
 *   onChange={handleUpdate}
 * />
 *
 * // In Modal
 * <Modal>
 *   <InterestsSelector value={temp} onChange={setTemp} />
 * </Modal>
 * ```
 */
export function InterestsSelector({
  value,
  onChange,
  variant = "full",
}: InterestsSelectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(
    null,
  );

  // Helper to get label by ID
  const getLabelById = (id: string) => {
    for (const cat of Object.values(interestsData)) {
      const item = cat.items.find((i) => i.id === id);
      if (item) return item.label;
    }
    return id;
  };

  const handleOptionToggle = (optionId: string) => {
    const isSelected = value.includes(optionId);
    if (isSelected) {
      onChange(value.filter((i) => i !== optionId));
    } else {
      onChange([...value, optionId]);
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
        const count = category.items.filter((item) =>
          value.includes(item.id),
        ).length;
        acc[key] = count;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [value]);

  return (
    <div className="mb-xl">
      {/* Show selected interests */}
      {value.length > 0 && variant === "full" && (
        <div className="mb-xxl">
          <h1 className="text-h3 font-bold mb-xl">You&apos;re into:</h1>
          <ul className="flex flex-wrap gap-sm">
            {value.map((interestId) => (
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
      <div className="grid grid-cols-1 gap-sm">
        {variant === "full" && (
          <h2 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-sm">
            Select all that interest you
          </h2>
        )}
        {categoryKeys.map((key) => (
          <CategoryRow
            key={key}
            title={interestsData[key].label}
            selectedCount={categoryCounts[key]}
            onClick={() => handleCategoryClick(key)}
            variant={variant === "compact" ? "compact" : "default"}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedCategoryKey && (
        <InterestsModal
          categoryKey={selectedCategoryKey}
          onClose={() => setShowModal(false)}
          selectedInterests={value}
          onOptionToggle={handleOptionToggle}
        />
      )}
    </div>
  );
}

export default InterestsSelector;
