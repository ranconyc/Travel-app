"use client";

import { ChevronRight } from "lucide-react";

interface CategoryRowProps {
  title: string;
  selectedCount: number;
  onClick: () => void;
  variant?: "default" | "compact";
}

/**
 * Reusable CategoryRow component for forms
 * Used in: InterestsStep, TravelForm, any selection-based UI
 */
export function CategoryRow({
  title,
  selectedCount,
  onClick,
  variant = "default",
}: CategoryRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left border-2 border-surface hover:border-brand transition-colors rounded-xl px-3 group ${
        variant === "compact" ? "py-1.5" : "py-2"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1
            className={`font-semibold ${variant === "compact" ? "text-sm" : ""}`}
          >
            {title}
          </h1>
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
      </div>
    </button>
  );
}

export default CategoryRow;
