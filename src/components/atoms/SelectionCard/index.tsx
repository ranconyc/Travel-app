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
  className,
  ...props
}: {
  type?: "checkbox" | "radio";
  id: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ size: number }> | string;
  isSelected: boolean;
  onChange?: (id: string) => void;
  className?: string;
}) => (
  <label
    className={`flex items-center gap-3 rounded-xl p-3 cursor-pointer border-2 transition-all ${
      isSelected
        ? "border-brand bg-brand/5 shadow-sm"
        : "border-2 border-surface hover:border-brand/30"
    } ${className}`}
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
          isSelected && typeof Icon === "string"
            ? "bg-brand/50"
            : isSelected
              ? "bg-brand"
              : "bg-surface"
        }`}
      >
        {typeof Icon === "string" ? (
          <div className="w-4 h-4 flex items-center justify-center">{Icon}</div>
        ) : (
          <Icon size={40} />
        )}
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
