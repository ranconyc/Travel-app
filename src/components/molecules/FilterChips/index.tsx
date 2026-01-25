import Button from "@/components/atoms/Button";

export type FilterChipsProps = {
  minAge: number;
  maxAge: number;
  maxDistance: number;
  onClearAll: () => void;
  onClearAge: () => void;
  onClearDistance: () => void;
};

export default function FilterChips({
  minAge,
  maxAge,
  maxDistance,
  onClearAll,
  onClearAge,
  onClearDistance,
}: FilterChipsProps) {
  // Check if any filters are active (non-default)
  const isAgeActive = minAge !== 18 || maxAge !== 60;
  const isDistanceActive = maxDistance !== 100;
  const hasActiveFilters = isAgeActive || isDistanceActive;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 px-md animate-fade-in">
      <span className="text-xs font-semibold text-secondary uppercase tracking-wider mr-2">
        Active Filters:
      </span>

      {/* Age Chip */}
      {isAgeActive && (
        <div className="flex items-center gap-1 bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-medium border border-brand/20">
          <span>
            Age: {minAge}-{maxAge}
          </span>
          <button
            onClick={onClearAge}
            className="hover:text-brand-dark ml-1"
            aria-label="Remove age filter"
          >
            ✕
          </button>
        </div>
      )}

      {/* Distance Chip */}
      {isDistanceActive && (
        <div className="flex items-center gap-1 bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-medium border border-brand/20">
          <span>Dist: {maxDistance}km</span>
          <button
            onClick={onClearDistance}
            className="hover:text-brand-dark ml-1"
            aria-label="Remove distance filter"
          >
            ✕
          </button>
        </div>
      )}

      {/* Clear All */}
      <button
        onClick={onClearAll}
        className="text-xs text-secondary hover:text-brand underline decoration-dotted underline-offset-2 transition-colors"
      >
        Clear All
      </button>
    </div>
  );
}
