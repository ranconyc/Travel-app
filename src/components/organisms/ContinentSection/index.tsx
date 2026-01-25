import React from "react";
import Typography from "@/components/atoms/Typography";
import CountryGrid from "@/components/molecules/CountryGrid";
import { SortedCountry } from "@/domain/country/country.service";

export interface ContinentSectionProps {
  continentName: string;
  countries: SortedCountry[];
  selectedCodes: string[];
  onToggleCountry: (code: string) => void;
  onSkip?: () => void;
  showSkip?: boolean;
}

/**
 * ContinentSection Organism
 *
 * Combines:
 * - Typography heading
 * - CountryGrid molecule
 * - Optional skip action
 *
 * Follows atomic architecture:
 * Organism = Header (Atom) + Grid (Molecule)
 */
export default function ContinentSection({
  continentName,
  countries,
  selectedCodes,
  onToggleCountry,
  onSkip,
  showSkip = false,
}: ContinentSectionProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography variant="h3" color="main">
          {continentName}
        </Typography>

        {showSkip && onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-txt-sec hover:text-brand transition-colors"
          >
            skip {">"}
          </button>
        )}
      </div>

      {/* Country Grid */}
      <CountryGrid
        countries={countries}
        selectedCodes={selectedCodes}
        onToggleCountry={onToggleCountry}
      />
    </div>
  );
}
