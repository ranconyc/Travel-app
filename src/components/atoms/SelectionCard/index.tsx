"use client";

import React from "react";

interface SelectionCardProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  isSelected: boolean;
  type?: "checkbox" | "radio";
  className?: string;
}

export const SelectionCard = ({
  label,
  description,
  icon,
  isSelected,
  type = "checkbox",
  className = "",
  ...props
}: SelectionCardProps) => (
  <label
    className={`flex items-center gap-md rounded-card p-sm cursor-pointer border-2 shadow-secondary transition-all ${
      isSelected
        ? "border-brand bg-brand/5 shadow-sm"
        : "border-2 border-bg-card hover:border-brand/30"
    } ${className}`}
  >
    <input type={type} className="sr-only" checked={isSelected} {...props} />

    {icon && (
      <div
        className={`p-sm rounded-pill transition-colors flex outline-none ${
          isSelected
            ? "bg-brand text-white"
            : "bg-bg-card text-txt-sec border border-stroke"
        }`}
      >
        {icon}
      </div>
    )}

    {!icon && (
      <div
        className={`p-sm rounded-full transition-colors flex-shrink-0 ${
          isSelected ? "bg-brand" : "bg-bg-card border border-stroke"
        }`}
      />
    )}

    <div className="text-left">
      <h4 className="text-txt-main font-bold leading-tight">{label}</h4>
      {description && (
        <p className="text-p text-txt-sec mt-xs">{description}</p>
      )}
    </div>
  </label>
);

export default SelectionCard;
