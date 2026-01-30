import React, { useMemo } from "react";
import { CountryItem } from "@/components/atoms/CountryItem";
import { SortedCountry } from "@/domain/country/country.service";
import { cn } from "@/lib/utils";

export interface CountryGridProps {
  countries: SortedCountry[];
  selectedCodes: string[];
  onToggleCountry: (code: string) => void;
  className?: string;
}

/**
 * CountryGrid Molecule
 *
 * Displays a grid of CountryItem atoms
 * - Responsive 2-column grid
 * - Memoized for performance
 * - Uses Tailwind spacing tokens
 */
export default function CountryGrid({
  countries,
  selectedCodes,
  onToggleCountry,
  className,
}: CountryGridProps) {
  // Memoize selected set for O(1) lookup
  const selectedSet = useMemo(() => new Set(selectedCodes), [selectedCodes]);

  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      {countries.map((country) => (
        <CountryItem
          key={country.code}
          code={country.code}
          label={country.name}
          flag={country.flag}
          isSelected={selectedSet.has(country.code)}
          isPopular={country.isPopular}
          onChange={onToggleCountry}
        />
      ))}
    </div>
  );
}
