"use client";

import SelectionCard from "@/components/molecules/SelectionCard";

interface SelectionOption {
  id: string;
  icon: React.ComponentType<{ size: number }>;
  label: string;
  description: string;
}

interface GenericSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectionOption[];
  variant?: "full" | "compact";
}

/**
 * GenericSelector - Pure, reusable single-selection component
 *
 * Used for rhythm, style, or any other single-choice selection.
 * Decoupled from form context for maximum reusability.
 *
 * @example
 * ```tsx
 * // In PersonaForm
 * <GenericSelector
 *   value={watch("dailyRhythm")}
 *   onChange={(val) => setValue("dailyRhythm", val)}
 *   options={rhythmOptions}
 * />
 *
 * // In Profile Edit
 * <GenericSelector
 *   value={userRhythm}
 *   onChange={handleUpdate}
 *   options={rhythmOptions}
 * />
 * ```
 */
export function GenericSelector({
  value,
  onChange,
  options,
  variant = "full",
}: GenericSelectorProps) {
  return (
    <div className="px-md grid grid-cols-1 gap-sm">
      {options.map((item) => (
        <SelectionCard
          key={item.id}
          type="radio"
          icon={<item.icon size={20} />}
          label={item.label}
          description={variant === "full" ? item.description : undefined}
          isSelected={value === item.id}
          onChange={() => onChange(item.id)}
        />
      ))}
    </div>
  );
}

export default GenericSelector;
