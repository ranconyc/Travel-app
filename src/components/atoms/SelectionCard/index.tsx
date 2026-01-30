"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const selectionCardVariants = cva(
  "group flex items-center rounded-card px-sm py-xs cursor-pointer border-1 transition-all duration-200 outline-none",
  {
    variants: {
      isSelected: {
        true: "border-brand bg-brand/10 shadow-sm",
        false: "border-bg-card hover:border-brand/30 shadow-secondary",
      },
    },
    defaultVariants: {
      isSelected: false,
    },
  },
);

const Indicator = ({
  isSelected,
  type,
  icon,
}: {
  isSelected?: boolean;
  type: "checkbox" | "radio";
  icon?: React.ReactNode;
}) => {
  // 1. Icon Mode: Wraps the icon in a container that responds to selection
  if (icon) {
    return (
      <div
        className={cn(
          "p-sm rounded-sm transition-colors duration-200 flex items-center justify-center",
          isSelected
            ? "bg-brand text-white border-2 border-brand"
            : "bg-surface-secondary text-txt-sec border-1 border-transparent",
        )}
      >
        {icon}
      </div>
    );
  }

  // 2. Standard Mode: Custom Radio/Checkbox UI
  const isRadio = type === "radio";
  const shape = isRadio ? "rounded-full" : "rounded-sm";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative h-5 w-5 flex shrink-0 items-center justify-center transition-all duration-200 border-1",
        shape,
        isSelected
          ? "bg-bg-card border-brand" // Selected: Brand border, White bg (to show inner dot)
          : "bg-bg-card border-surface-secondary group-hover:border-brand/50", // Unselected: Neutral border
      )}
    >
      {/* Animated Inner Indicator */}
      {isSelected && (
        <span
          className={cn(
            "h-3 w-3 bg-brand transition-transform duration-200",
            isRadio ? "rounded-full" : "rounded-xs",
            isSelected ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
      )}
    </div>
  );
};

interface SelectionCardProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
    VariantProps<typeof selectionCardVariants> {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  type?: "checkbox" | "radio";
}

export const SelectionCard = ({
  label,
  description,
  icon,
  isSelected,
  type = "checkbox",
  className,
  ...props
}: SelectionCardProps) => {
  return (
    <label
      className={cn(
        selectionCardVariants({ isSelected }),
        icon ? "gap-md" : "gap-sm justify-center",
        "focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 focus-within:ring-offset-bg-main", // A11y Focus Ring
        "active:scale-[0.98]", // Micro-interaction press effect
        className,
      )}
    >
      <Indicator isSelected={!!isSelected} type={type} icon={icon} />

      <input
        type={type}
        className="sr-only"
        checked={!!isSelected}
        {...props}
      />

      <div className="flex flex-col text-left select-none">
        <h4
          className={cn(
            "text-body font-semibold leading-tight transition-colors",
            isSelected ? "text-brand-dark" : "text-txt-main",
          )}
        >
          {label}
        </h4>
        {description && (
          <p className="text-sm text-txt-sec mt-xxs leading-snug">
            {description}
          </p>
        )}
      </div>
    </label>
  );
};

export default SelectionCard;
