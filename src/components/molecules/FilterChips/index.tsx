import Button from "@/components/atoms/Button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const chipVariants = cva(
  "flex items-center gap-1 rounded-full text-xs font-medium border transition-colors",
  {
    variants: {
      active: {
        true: "bg-brand/10 text-brand border-brand/20",
        false: "bg-surface text-txt-sec border-surface-secondary",
      },
      interactive: {
        true: "cursor-pointer hover:bg-bg-hover",
        false: "",
      },
    },
    defaultVariants: {
      active: true,
      interactive: false,
    },
  },
);

export type FilterChipsProps = {
  minAge: number;
  maxAge: number;
  maxDistance: number;
  onClearAll: () => void;
  onClearAge: () => void;
  onClearDistance: () => void;
  className?: string; // Standard component prop
};

export default function FilterChips({
  minAge,
  maxAge,
  maxDistance,
  onClearAll,
  onClearAge,
  onClearDistance,
  className,
}: FilterChipsProps) {
  // Check if any filters are active (non-default)
  const isAgeActive = minAge !== 18 || maxAge !== 60;
  const isDistanceActive = maxDistance !== 100;
  const hasActiveFilters = isAgeActive || isDistanceActive;

  if (!hasActiveFilters) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 px-md animate-fade-in",
        className,
      )}
    >
      <span className="text-xs font-semibold text-secondary uppercase tracking-wider mr-2">
        Active Filters:
      </span>

      {/* Age Chip */}
      {isAgeActive && (
        <div className={chipVariants({ active: true })}>
          <span className="pl-3 py-1">
            Age: {minAge}-{maxAge}
          </span>
          <button
            onClick={onClearAge}
            className="hover:text-brand-dark px-2 py-1 rounded-full transition-colors flex items-center justify-center"
            aria-label="Remove age filter"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Distance Chip */}
      {isDistanceActive && (
        <div className={chipVariants({ active: true })}>
          <span className="pl-3 py-1">Dist: {maxDistance}km</span>
          <button
            onClick={onClearDistance}
            className="hover:text-brand-dark px-2 py-1 rounded-full transition-colors flex items-center justify-center"
            aria-label="Remove distance filter"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Clear All */}
      <button
        onClick={onClearAll}
        className="text-xs text-secondary hover:text-brand underline decoration-dotted underline-offset-2 transition-colors ml-1"
      >
        Clear All
      </button>
    </div>
  );
}
