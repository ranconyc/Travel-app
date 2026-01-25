"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { Search, MapPin, Loader2, Globe, ArrowRight } from "lucide-react";
import { useCitySearch } from "@/domain/search/search.hooks";
import { SearchResult } from "@/domain/search/search.schema";
import { useClickOutside } from "@/hooks/ui/useClickOutside";

/**
 * Memoized search result item component to prevent unnecessary re-renders
 */
const SearchResultItem = memo(
  ({
    item,
    index,
    onClick,
  }: {
    item: SearchResult;
    index: number;
    onClick: (item: SearchResult, index: number) => void;
  }) => (
    <button
      key={item.id}
      onClick={() => onClick(item, index)}
      className="w-full px-4 py-3 flex items-center gap-md hover:bg-surface-hover transition-colors text-left group"
    >
      <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center shrink-0 text-xl overflow-hidden border border-border">
        {item.flag ? (
          <span className="text-2xl">{item.flag}</span>
        ) : item.type === "CITY" ? (
          <MapPin className="w-5 h-5 text-brand" />
        ) : (
          <Globe className="w-5 h-5 text-blue-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-txt-main truncate group-hover:text-brand transition-colors">
          {item.name}
        </p>
        <p className="text-sm text-secondary truncate">{item.subText}</p>
      </div>
      {item.type === "EXTERNAL" && (
        <span className="text-xs bg-brand/20 text-brand px-2 py-1 rounded-full">
          New
        </span>
      )}
    </button>
  ),
);

SearchResultItem.displayName = "SearchResultItem";

export default function HomeHeroSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    query,
    setQuery,
    results,
    isLoading,
    isExternalLoading,
    showExternalOption,
    handleSelect,
    handleExternalSearch,
  } = useCitySearch();

  // Close dropdown when clicking outside
  useClickOutside(containerRef as React.RefObject<HTMLElement>, () => {
    setIsOpen(false);
  });

  // Show dropdown when results arrive
  useEffect(() => {
    if (results.length > 0) {
      setIsOpen(true);
    }
  }, [results.length]);

  // Enhanced handleSelect that closes dropdown
  const handleSelectAndClose = (item: SearchResult, index: number) => {
    handleSelect(item, index);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full flex flex-col">
      <div className="relative group w-full">
        <div className="absolute inset-y-0 left-md flex items-center pointer-events-none z-10">
          <Search className="w-5 h-5 text-secondary group-focus-within:text-brand transition-colors" />
        </div>
        <input
          id="home-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destination..."
          className="w-full h-14 pl-11 pr-xl bg-surface border border-border rounded-xl text-p text-txt-main placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand shadow-sm transition-all"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-xl flex items-center">
            <Loader2 className="w-5 h-5 text-brand animate-spin" />
          </div>
        )}
      </div>

      {isOpen && (results.length > 0 || showExternalOption) && (
        <div className="absolute top-16 left-0 right-0 bg-surface/90 backdrop-blur-xl border border-border rounded-3xl shadow-xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto">
          {results.length > 0 && (
            <div className="py-2">
              <span className="px-4 py-2 text-xs font-bold text-secondary uppercase tracking-wider block">
                Destinations
              </span>
              {results.map((item, index) => (
                <SearchResultItem
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={handleSelectAndClose}
                />
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
            <div className="p-md flex items-center justify-center gap-2 text-secondary text-sm">
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
