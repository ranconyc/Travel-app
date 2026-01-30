"use client";

import Typography from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import { Search } from "lucide-react";

interface NoMatesFoundProps {
  onClearFilters: () => void;
  hasActiveFilters?: boolean;
}

/**
 * NoMatesFound - Empty state for when no mates match current filters
 * Shows a friendly message and option to clear filters
 */
export default function NoMatesFound({
  onClearFilters,
  hasActiveFilters = true,
}: NoMatesFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-surface-secondary flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-txt-muted" strokeWidth={1.5} />
      </div>

      {/* Message */}
      <Typography variant="h3" weight="bold" color="main" className="mb-2">
        No mates found
      </Typography>
      <Typography variant="body" color="sec" className="mb-6">
        {hasActiveFilters
          ? "No travel partners match your current filters. Try broadening your search."
          : "No travel partners available in your area right now. Check back soon!"}
      </Typography>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button variant="secondary" onClick={onClearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );
}
