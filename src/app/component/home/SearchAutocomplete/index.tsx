/**
 * Search Autocomplete Component
 * Dedicated search component with custom rendering for categorized results
 */

"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Autocomplete } from "@/app/component/form/Autocomplete";
import { SearchResult, SearchResultType } from "@/types/search";
import { getOrCreateSessionId } from "@/lib/utils/session";
import { trackSearchEvent } from "@/lib/actions/search.actions";

interface SearchAutocompleteProps {
  userId?: string;
  className?: string;
}

export default function SearchAutocomplete({
  userId,
  className = "",
}: SearchAutocompleteProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const resultsRef = useRef<SearchResult[]>([]);

  /**
   * Load search results from API
   */
  const loadSearchResults = useCallback(
    async (query: string, signal: AbortSignal): Promise<SearchResult[]> => {
      const trimmed = query.trim();
      if (!trimmed || trimmed.length < 2) return [];

      try {
        const params = new URLSearchParams({ q: trimmed });
        if (userId) params.set("userId", userId);

        const res = await fetch(`/api/search?${params.toString()}`, { signal });

        if (!res.ok) {
          console.error("Search API error:", res.status);
          return [];
        }

        const data = await res.json();
        const results = data.results || [];

        // Store results for analytics tracking
        resultsRef.current = results;

        // Track search query (without click)
        const sessionId = getOrCreateSessionId();
        trackSearchEvent({
          userId,
          sessionId,
          searchQuery: trimmed,
          resultCount: results.length,
          pagePath: "/",
        }).catch((err) => console.error("Failed to track search:", err));

        return results;
      } catch (error) {
        if ((error as Error)?.name !== "AbortError") {
          console.error("Search error:", error);
        }
        return [];
      }
    },
    [userId]
  );

  /**
   * Handle result selection - navigate and track analytics
   */
  const handleSelect = useCallback(
    (option: SearchResult) => {
      const sessionId = getOrCreateSessionId();
      const clickedIndex = resultsRef.current.findIndex(
        (r) => r.id === option.id
      );

      console.log("clickedIndex", clickedIndex);
      console.log("option", option);

      // Track click event
      trackSearchEvent({
        userId,
        sessionId,
        searchQuery,
        resultCount: resultsRef.current.length,
        clickedResultIndex: clickedIndex >= 0 ? clickedIndex : undefined,
        clickedEntityType: option.type,
        pagePath: "/",
      }).catch((err) => console.error("Failed to track click:", err));

      // Navigate to appropriate page (using singular routes with slugs)
      const routes: Record<SearchResultType, string> = {
        city: `/city/${option.entityId}`,
        country: `/country/${option.entityId}`,
        activity: `/activity/${option.entityId}`,
        trip: `/trip/${option.entityId}`,
      };

      const route = routes[option.type];
      if (route) {
        router.push(route);
      }
    },
    [userId, searchQuery, router]
  );

  return (
    <div className={`relative ${className}`}>
      <Autocomplete
        id="global-search"
        name="search"
        placeholder="Search destinations, activities..."
        loadOptions={loadSearchResults}
        value={searchQuery}
        onQueryChange={setSearchQuery}
        onSelect={(_: string, option?: any) => {
          if (option) handleSelect(option as SearchResult);
        }}
        minChars={2}
        clearOnSelect={true}
        openOnFocus={false}
        inputClassName="w-full bg-gray-800 text-white border-0 p-3 pr-12 rounded-xl placeholder:text-gray-400 focus:bg-gray-700"
        listClassName="bg-white border border-gray-200 rounded-lg shadow-lg mt-2"
        optionClassName={(active: boolean) =>
          `cursor-pointer px-3 py-2 ${
            active ? "bg-cyan-100" : "hover:bg-gray-50"
          }`
        }
      />
      <div className="border border-green-700 absolute inset-y-0 right-0 flex items-center justify-center pointer-events-none">
        <div className="p-2 bg-black rounded-lg">
          <Search size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}
