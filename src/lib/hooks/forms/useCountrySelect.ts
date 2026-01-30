import { useMemo, useCallback } from "react";
import {
  getSortedCountriesByContinent,
  getContinents,
  type SortedCountry,
} from "@/domain/country/country.service";

export interface UseCountrySelectOptions {
  continent?: string;
  onToggle?: (code: string) => void;
}

export interface UseCountrySelectReturn {
  continents: string[];
  getCountriesByContinent: (continent: string) => SortedCountry[];
  toggleCountry: (code: string, selectedCodes: string[]) => string[];
  toggleContinent: (continent: string, selectedCodes: string[]) => string[];
}

/**
 * Hook for country selection functionality
 *
 * Provides sorted countries by continent with selection logic
 *
 * @example
 * ```typescript
 * const { continents, getCountriesByContinent, toggleCountry } = useCountrySelect();
 * const [selected, setSelected] = useState<string[]>([]);
 *
 * const handleToggle = (code: string) => {
 *   setSelected(toggleCountry(code, selected));
 * };
 * ```
 */
export function useCountrySelect(
  options: UseCountrySelectOptions = {},
): UseCountrySelectReturn {
  const { onToggle } = options;

  // Memoize continents list
  const continents = useMemo(() => getContinents(), []);

  // Memoize country getter
  const getCountriesByContinent = useCallback(
    (continent: string): SortedCountry[] => {
      return getSortedCountriesByContinent(continent);
    },
    [],
  );

  // Toggle single country
  const toggleCountry = useCallback(
    (code: string, selectedCodes: string[]): string[] => {
      const newSelection = selectedCodes.includes(code)
        ? selectedCodes.filter((c) => c !== code)
        : [...selectedCodes, code];

      if (onToggle) {
        onToggle(code);
      }

      return newSelection;
    },
    [onToggle],
  );

  // Toggle all countries in a continent
  const toggleContinent = useCallback(
    (continent: string, selectedCodes: string[]): string[] => {
      const countriesInContinent = getSortedCountriesByContinent(continent);
      const continentCodes = countriesInContinent.map((c) => c.code);

      const allSelected = continentCodes.every((code) =>
        selectedCodes.includes(code),
      );

      if (allSelected) {
        // Deselect all
        return selectedCodes.filter((code) => !continentCodes.includes(code));
      } else {
        // Select all
        const newCodes = continentCodes.filter(
          (code) => !selectedCodes.includes(code),
        );
        return [...selectedCodes, ...newCodes];
      }
    },
    [],
  );

  return {
    continents,
    getCountriesByContinent,
    toggleCountry,
    toggleContinent,
  };
}
