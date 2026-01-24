"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Loader2, Globe, ArrowRight } from "lucide-react";
import { useSearch, useExternalSearch } from "@/domain/search/search.hooks";
import {
  trackSearchEvent,
  saveExternalDestinationAction,
} from "@/domain/search/search.actions";
import { SearchResult } from "@/domain/search/search.schema";

export default function HomeHeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [triggerExternal, setTriggerExternal] = useState(false);
  const [isExternalLoadingManual, setIsExternalLoadingManual] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const { data: internalResults, isLoading: isInternalLoading } =
    useSearch(query);
  const { data: externalResults, isFetching: isExternalFetching } =
    useExternalSearch(query, {
      enabled: triggerExternal,
    });

  // Combine results
  const results = [...(internalResults || []), ...(externalResults || [])];
  const isLoading = isInternalLoading;
  const isExternalLoading = isExternalFetching || isExternalLoadingManual;

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show dropdown when results arrive
  useEffect(() => {
    if (internalResults && internalResults.length > 0) {
      setIsOpen(true);
    }
  }, [internalResults]);

  const handleSelect = async (item: SearchResult, index: number) => {
    // Generate a simple session for tracking if not available
    const sessionId = `session-${Date.now()}`;

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
      router.push(`/countries/${item.slug}`);
    }
    setIsOpen(false);
  };

  const handleExternalSearch = () => {
    setTriggerExternal(true);
  };

  const showExternalOption = query.length >= 2 && !triggerExternal;

  return (
    <div ref={containerRef} className="relative w-full max-w-lg mx-auto">
      <div className="relative group">
        <div className="absolute z-10 inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-secondary group-focus-within:text-brand transition-colors" />
        </div>
        <input
          id="home-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destination..."
          className="w-full h-14 pl-12 pr-4 bg-surface/80 backdrop-blur-md border border-border rounded-full text-app-text placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand shadow-lg transition-all"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-4 flex items-center">
            <Loader2 className="w-5 h-5 text-brand animate-spin" />
          </div>
        )}
      </div>

      {isOpen && (results.length > 0 || showExternalOption) && (
        <div className="absolute top-16 left-0 right-0 bg-surface/90 backdrop-blur-xl border border-border rounded-3xl shadow-2xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto">
          {results.length > 0 && (
            <div className="py-2">
              <span className="px-4 py-2 text-xs font-bold text-secondary uppercase tracking-wider block">
                Destinations
              </span>
              {results.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item, index)}
                  className="w-full px-4 py-3 flex items-center gap-4 hover:bg-surface-hover transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center flex-shrink-0 text-xl overflow-hidden border border-border">
                    {item.flag ? (
                      <span className="text-2xl">{item.flag}</span>
                    ) : item.type === "CITY" ? (
                      <MapPin className="w-5 h-5 text-brand" />
                    ) : (
                      <Globe className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-app-text truncate group-hover:text-brand transition-colors">
                      {item.name}
                    </p>
                    <p className="text-sm text-secondary truncate">
                      {item.subText}
                    </p>
                  </div>
                  {item.type === "EXTERNAL" && (
                    <span className="text-xs bg-brand/20 text-brand px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {showExternalOption && !isLoading && !isExternalLoading && (
            <div className="border-t border-white/5 p-2">
              <button
                onClick={handleExternalSearch}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-brand/10 rounded-xl transition-colors text-left text-brand"
              >
                <span className="font-medium">
                  Search globally for &quot;{query}&quot;
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {isExternalLoading && (
            <div className="p-4 flex items-center justify-center gap-2 text-secondary text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching the globe...</span>
            </div>
          )}

          {results.length === 0 &&
            !showExternalOption &&
            !isLoading &&
            !isExternalLoading && (
              <div className="p-8 text-center text-secondary">
                No results found
              </div>
            )}
        </div>
      )}
    </div>
  );
}
