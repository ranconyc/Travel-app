"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import Typography from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import RangeSlider from "@/components/atoms/RangeSlider";
import GenderToggle from "@/components/molecules/GenderToggle";
import { MateFilters } from "@/domain/discovery/discovery.service";
import { Gender } from "@/domain/user/user.schema";
import interestsData from "@/data/interests.json";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// --- Variants ---

const filterSectionVariants = cva(
  "border-1 rounded-xl overflow-hidden transition-colors",
  {
    variants: {
      expanded: {
        true: "border-surface-secondary",
        false: "border-surface-secondary",
      },
    },
    defaultVariants: {
      expanded: false,
    },
  },
);

const filterHeaderVariants = cva(
  "w-full flex items-center justify-between px-4 py-3 transition-colors",
  {
    variants: {
      active: {
        true: "bg-surface-secondary",
        false: "bg-surface hover:bg-surface-secondary",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

// --- Types ---

interface MatesFilterPanelProps {
  filters: MateFilters;
  onUpdateFilters: (update: Partial<MateFilters>) => void;
  onResetFilters: () => void;
  className?: string;
  /** Controlled open state for mobile sheet */
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Separate toggle button for PageNavigation
export interface FilterToggleButtonProps {
  onClick: () => void;
  hasActiveFilters: boolean;
}

export function FilterToggleButton({
  onClick,
  hasActiveFilters,
}: FilterToggleButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-surface-secondary hover:bg-surface relative"
      aria-label="Open filters"
    >
      <SlidersHorizontal size={20} />
      {hasActiveFilters && (
        <span className="absolute top-0 right-0 w-3 h-3 bg-brand rounded-full border-2 border-surface" />
      )}
    </Button>
  );
}

type InterestCategory = {
  id: string;
  label: string;
  items: { id: string; label: string }[];
};

// Parse interests from JSON
const interestCategories: InterestCategory[] = Object.entries(
  interestsData,
).map(([, category]) => ({
  id: (category as { id: string }).id,
  label: (category as { label: string }).label,
  items: (category as { items: { id: string; label: string }[] }).items,
}));

/**
 * MatesFilterPanel - Filter panel for mates discovery
 * Desktop: Fixed right-side panel with card-glass styling
 * Mobile: Bottom sheet with drag handle
 */
export default function MatesFilterPanel({
  filters,
  onUpdateFilters,
  onResetFilters,
  className = "",
  isOpen: controlledIsOpen,
  onOpenChange,
}: MatesFilterPanelProps) {
  // Controlled or uncontrolled open state
  const isOpen = controlledIsOpen ?? false;
  const setIsOpen = onOpenChange ?? (() => {});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Check if any filters are active (non-default)
  const hasActiveFilters = useMemo(() => {
    return (
      filters.gender !== "NON_BINARY" ||
      filters.ageRange.min !== 18 ||
      filters.ageRange.max !== 100 ||
      filters.interests.length > 0 ||
      filters.search !== ""
    );
  }, [filters]);

  const handleInterestToggle = useCallback(
    (interestId: string) => {
      const newInterests = filters.interests.includes(interestId)
        ? filters.interests.filter((i) => i !== interestId)
        : [...filters.interests, interestId];
      onUpdateFilters({ interests: newInterests });
    },
    [filters.interests, onUpdateFilters],
  );

  const filterContent = (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div>
        <Input
          placeholder="Search by name..."
          value={filters.search}
          onChange={(e) => onUpdateFilters({ search: e.target.value })}
          className="w-full"
        />
      </div>

      {/* Gender */}
      <div>
        <Typography variant="tiny" className="text-txt-sec mb-3 block">
          Gender
        </Typography>
        <GenderToggle
          gender={filters.gender}
          setGender={(gender) =>
            onUpdateFilters({ gender: gender as Gender | "NON_BINARY" })
          }
        />
      </div>

      {/* Age Range */}
      <RangeSlider
        min={18}
        max={100}
        value={[filters.ageRange.min, filters.ageRange.max]}
        onChange={([min, max]) => onUpdateFilters({ ageRange: { min, max } })}
        label="Age Range"
        unit=" yrs"
      />

      {/* Distance - with Worldwide option */}
      <div>
        <RangeSlider
          min={1}
          max={20000}
          value={[filters.distance.min, filters.distance.max]}
          onChange={([min, max]) => onUpdateFilters({ distance: { min, max } })}
          label="Distance"
          unit=" km"
          step={50}
          formatValue={(val) => (val >= 20000 ? "Worldwide" : `${val} km`)}
        />
        <Button
          variant={filters.distance.max >= 20000 ? "primary" : "ghost"}
          size="sm"
          onClick={() => onUpdateFilters({ distance: { min: 1, max: 20000 } })}
          className={cn(
            "mt-2 rounded-full text-xs h-8",
            filters.distance.max >= 20000
              ? ""
              : "bg-surface-secondary text-txt-sec hover:bg-brand/10",
          )}
        >
          🌍 Worldwide
        </Button>
      </div>

      {/* Interests - Grouped */}
      <div>
        <Typography variant="tiny" className="text-txt-sec mb-3 block">
          Interests
        </Typography>
        <div className="flex flex-col gap-2">
          {interestCategories.map((category) => {
            const isExpanded = expandedCategory === category.id;
            return (
              <div
                key={category.id}
                className={filterSectionVariants({ expanded: isExpanded })}
              >
                <button
                  onClick={() =>
                    setExpandedCategory(isExpanded ? null : category.id)
                  }
                  className={filterHeaderVariants({ active: isExpanded })}
                >
                  <Typography variant="p" className="font-medium">
                    {category.label}
                  </Typography>
                  <span
                    className={cn(
                      "transform transition-transform text-secondary",
                      isExpanded ? "rotate-180" : "",
                    )}
                  >
                    ▼
                  </span>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 flex flex-wrap gap-2 bg-surface-secondary/30">
                        {category.items.map((item) => {
                          const isSelected = filters.interests.includes(
                            item.id,
                          );
                          return (
                            <Button
                              key={item.id}
                              variant={isSelected ? "primary" : "secondary"}
                              size="sm"
                              onClick={() => handleInterestToggle(item.id)}
                              className={cn(
                                "rounded-full text-sm h-8 px-3",
                                isSelected
                                  ? ""
                                  : "bg-surface text-txt-main hover:bg-brand/10 border-0",
                              )}
                            >
                              {item.label}
                            </Button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={onResetFilters}
          className="w-full flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} />
          Reset Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop: Fixed Right Panel */}
      <aside className={cn("hidden lg:block w-80 shrink-0", className)}>
        <div className="sticky top-24 card-glass rounded-2xl p-5 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4">Filters</Typography>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 bg-brand text-white text-xs rounded-full">
                Active
              </span>
            )}
          </div>
          {filterContent}
        </div>
      </aside>

      {/* Mobile: Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-modal"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-modal bg-surface rounded-t-3xl max-h-[85vh] overflow-hidden"
            >
              {/* Drag Handle */}
              <div className="flex justify-center py-3">
                <div className="w-10 h-1 bg-surface-secondary rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-4 border-b border-surface-secondary">
                <Typography variant="h4">Filters</Typography>
                <Button
                  variant="icon"
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center"
                  aria-label="Close filters"
                  icon={<X size={20} />}
                />
              </div>

              {/* Content */}
              <div className="p-5 overflow-y-auto max-h-[calc(85vh-100px)]">
                {filterContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
