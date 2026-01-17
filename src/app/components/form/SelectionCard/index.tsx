"use client";

import React from "react";

export const SelectionCard = ({
  id,
  label,
  description,
  icon: Icon,
  isSelected,
  onChange,
  type = "checkbox",
  ...props
}: {
  type?: "checkbox" | "radio";
  id: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ size: number }>;
  isSelected: boolean;
  onChange?: (id: string) => void;
}) => (
  <label
    className={`flex items-center gap-3 rounded-xl p-3 cursor-pointer border-2 transition-all ${
      isSelected
        ? "border-brand bg-brand/5 shadow-sm"
        : "border-2 border-surface hover:border-brand/30"
    }`}
  >
    <input
      type={type}
      className="sr-only"
      checked={isSelected}
      onChange={() => onChange?.(id)}
      {...props}
    />
    {Icon ? (
      <div
        className={`p-2 rounded-md transition-colors ${
          isSelected ? "bg-brand " : "bg-surface"
        }`}
      >
        <Icon size={24} />
      </div>
    ) : (
      <div
        className={`p-2 rounded-full transition-colors  ${isSelected ? "bg-brand " : "bg-surface"}`}
      />
    )}
    <div className="text-left">
      <h4 className="text-app-text leading-tight">{label}</h4>
      {description && (
        <p className="text-xs text-secondary mt-0.5">{description}</p>
      )}
    </div>
  </label>
);

export default SelectionCard;
