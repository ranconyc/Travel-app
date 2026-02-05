import { useQuery } from "@tanstack/react-query";
import { useMemo, useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  searchDestinationsAction,
  searchExternalDestinationsAction,
  trackSearchEvent,
  saveExternalDestinationAction,
} from "./search.actions";
import { SearchResult } from "./search.schema";

export function useSearch(query: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const res = await searchDestinationsAction({ query });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    enabled: options.enabled !== false && query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useExternalSearch(
  query: string,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ["search-external", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const res = await searchExternalDestinationsAction({ query });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    enabled: options.enabled === true && query.length >= 2,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Custom hook that encapsulates all search logic for HomeHeroSearch component.
 * Handles internal/external search combination, result management, and navigation.
 */
export function useCitySearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [triggerExternal, setTriggerExternal] = useState(false);
  const [isExternalLoadingManual, setIsExternalLoadingManual] = useState(false);

  // Internal search (database)
  const { data: internalResults, isLoading: isInternalLoading } =
    useSearch(query);

  // External search (LocationIQ/Google)
  const { data: externalResults, isFetching: isExternalFetching } =
    useExternalSearch(query, {
      enabled: triggerExternal,
    });

  // Combine and memoize results
  const results = useMemo(
    () => [...(internalResults || []), ...(externalResults || [])],
    [internalResults, externalResults],
  );

  // Loading states
  const isLoading = isInternalLoading;
  const isExternalLoading = isExternalFetching || isExternalLoadingManual;

  // Show external search option when query is long enough and not yet triggered
  const showExternalOption = useMemo(
    () => query.length >= 2 && !triggerExternal,
    [query, triggerExternal],
  );

  // Handle result selection with analytics and navigation
  const handleSelect = useCallback(
    async (item: SearchResult, index: number) => {
      // Generate session ID for tracking
      const sessionId = `session-${Date.now()}`;

      // Track search event (click)
      await trackSearchEvent({
        searchQuery: query,
        resultCount: results.length,
        clickedResultIndex: index,
        pagePath: window.location.pathname,
        sessionId,
        clickedEntityType:
          item.type === "CITY"
            ? "city"
            : item.type === "COUNTRY"
              ? "country"
              : undefined,
      });

      // Handle external destinations (need to create in DB first)
      if (item.type === "EXTERNAL") {
        setIsExternalLoadingManual(true);
        try {
          const res = await saveExternalDestinationAction({
            externalItem: item.externalData,
          });
          if (res.success && res.data) {
            router.push(`/cities/${res.data}`);
          } else {
            alert("Could not load this destination details.");
          }
        } finally {
          setIsExternalLoadingManual(false);
        }
      } else if (item.type === "CITY") {
        router.push(`/cities/${item.slug}`);
      } else {
        router.push(`/countries/${item.slug.toLowerCase()}`);
      }
    },
    [query, results.length, router],
  );

  // Debounced Intent Tracking
  useEffect(() => {
    if (!query || query.length < 3) return;

    const sessionId = `session-intent-${Date.now()}`;
    const timer = setTimeout(() => {
      trackSearchEvent({
        searchQuery: query,
        resultCount: results.length,
        sessionId,
        pagePath: window.location.pathname,
      });
    }, 2000); // 2 second pause in typing records "intent"

    return () => clearTimeout(timer);
  }, [query, results.length]);

  // Trigger external search
  const handleExternalSearch = useCallback(() => {
    setTriggerExternal(true);
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    isExternalLoading,
    showExternalOption,
    handleSelect,
    handleExternalSearch,
  };
}
