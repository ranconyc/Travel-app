"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Loader2, Globe, ArrowRight } from "lucide-react";
import { useDebounce } from "@/app/_utils/useDebounce"; // Assuming this exists or I implement it
import {
  searchDestinations,
  trackSearch,
  searchExternalDestinations,
  saveExternalDestination,
  SearchResult,
} from "@/app/actions/search.actions";

export default function HomeHeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showExternalOption, setShowExternalOption] = useState(false);
  const [isExternalLoading, setIsExternalLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Search effect
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setShowExternalOption(false);
      try {
        const data = await searchDestinations(debouncedQuery);
        setResults(data);
        setIsOpen(true);
        // Show external option if few results or user might want more
        setShowExternalOption(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSelect = async (item: SearchResult, index: number) => {
    await trackSearch(query, results.length, index, window.location.pathname);

    if (item.type === "EXTERNAL") {
      setIsExternalLoading(true);
      try {
        const cityId = await saveExternalDestination(item.externalData);
        if (cityId) {
          router.push(`/cities/${cityId}`);
        } else {
          // Fallback/Error UI?
          alert("Could not load this destination details.");
        }
      } finally {
        setIsExternalLoading(false);
      }
    } else if (item.type === "CITY") {
      router.push(`/cities/${item.slug}`);
    } else {
      router.push(`/countries/${item.slug}`);
    }
    setIsOpen(false);
  };

  const handleExternalSearch = async () => {
    setIsExternalLoading(true);
    try {
      const externalResults = await searchExternalDestinations(query);
      // deduplicate?
      setResults((prev) => [...prev, ...externalResults]);
    } finally {
      setIsExternalLoading(false);
      setShowExternalOption(false); // Hide button after searching
    }
  };

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
