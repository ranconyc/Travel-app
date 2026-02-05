import { useState, useCallback } from "react";
import { searchCityAction } from "@/domain/city/city.actions";
import { PAGINATION } from "@/config/ui-constants";
import { handleAsyncError } from "@/lib/errors/error-handler";

export interface CityOption {
  id: string;
  label: string;
  subtitle?: string;
}

export interface UseCityAutocompleteOptions {
  limit?: number;
  onError?: (error: unknown) => void;
}

export interface UseCityAutocompleteReturn {
  loadOptions: (query: string) => Promise<CityOption[]>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for city autocomplete functionality
 *
 * Provides standardized city search with error handling and loading states
 *
 * @example
 * ```typescript
 * const { loadOptions, isLoading } = useCityAutocomplete();
 *
 * <Autocomplete
 *   loadOptions={loadOptions}
 *   placeholder="Search cities..."
 * />
 * ```
 */
export function useCityAutocomplete(
  options: UseCityAutocompleteOptions = {},
): UseCityAutocompleteReturn {
  const { limit = PAGINATION.CITIES_AUTOCOMPLETE, onError } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOptions = useCallback(
    async (query: string): Promise<CityOption[]> => {
      if (!query || query.trim().length < 2) {
        return [];
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await searchCityAction({ query, limit });

        if (!res.success || !res.data) {
          throw new Error("Failed to load cities");
        }

        return res.data.map((c) => ({
          id: c.id,
          label: c.label,
          subtitle: c.subtitle || undefined,
        }));
      } catch (err) {
        const errorMessage = "Failed to search cities";
        setError(errorMessage);

        handleAsyncError(err, {
          userMessage: errorMessage,
          logContext: "CityAutocomplete",
          showToast: false, // Don't show toast for autocomplete failures
        });

        if (onError) {
          onError(err);
        }

        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [limit, onError],
  );

  return {
    loadOptions,
    isLoading,
    error,
  };
}
