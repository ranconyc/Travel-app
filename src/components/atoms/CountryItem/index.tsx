import React, { memo } from "react";
import Typography from "@/components/atoms/Typography";

export interface CountryItemProps {
  code: string;
  label: string;
  flag: string;
  isSelected: boolean;
  isPopular: boolean;
  onChange: (code: string) => void;
}

/**
 * CountryItem Atom
 *
 * A memoized country selection item with:
 * - Popular badge for top destinations
 * - Flag emoji
 * - Selection state
 * - Optimized for performance with React.memo
 */
function CountryItemComponent({
  code,
  label,
  flag,
  isSelected,
  isPopular,
  onChange,
}: CountryItemProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(code)}
      className={`
        relative flex flex-col items-center justify-center
        p-3 rounded-xl border-2 transition-all
        ${
          isSelected
            ? "border-brand bg-brand/10"
            : "border-surface-secondary bg-surface/30 hover:border-surface-secondary/60"
        }
      `}
      aria-label={`${isSelected ? "Deselect" : "Select"} ${label}`}
      aria-pressed={isSelected}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-1 right-1 bg-brand/90 text-white px-1.5 py-0.5 rounded text-micro font-bold">
          ⭐
        </div>
      )}

      {/* Flag */}
      <div className="text-3xl mb-1">{flag}</div>

      {/* Country Name */}
      <Typography
        variant="tiny"
        color={isSelected ? "brand" : "sec"}
        className="text-center font-bold leading-tight"
      >
        {label.length > 15 ? code : label}
      </Typography>
    </button>
  );
}

/**
 * Memoized CountryItem for performance
 * Only re-renders when props change
 */
export const CountryItem = memo(CountryItemComponent);
