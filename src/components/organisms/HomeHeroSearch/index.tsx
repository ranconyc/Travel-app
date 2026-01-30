"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { Search, MapPin, Loader2, Globe, ArrowRight } from "lucide-react";
import Typography from "@/components/atoms/Typography";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useCitySearch } from "@/domain/search/search.hooks";
import { SearchResult } from "@/domain/search/search.schema";
import { useClickOutside } from "@/lib/hooks/ui/useClickOutside";

const searchResultItemVariants = cva(
  "w-full px-4 py-3 flex items-center gap-md transition-colors text-left group cursor-pointer",
  {
    variants: {
      variant: {
        default: "hover:bg-surface-hover",
        active: "bg-surface-active",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const searchIconVariants = cva(
  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xl overflow-hidden border border-border transition-colors",
  {
    variants: {
      type: {
        default: "bg-surface-secondary text-brand",
        globe: "bg-surface-secondary text-blue-400",
        flag: "bg-surface-secondary border-transparent",
      },
    },
    defaultVariants: {
      type: "default",
    },
  },
);

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
      className={cn(searchResultItemVariants())}
    >
      <div
        className={cn(
          searchIconVariants({
            type: item.flag
              ? "flag"
              : item.type === "CITY"
                ? "default"
                : "globe",
          }),
        )}
      >
        {item.flag ? (
          <span className="text-2xl">{item.flag}</span>
        ) : item.type === "CITY" ? (
          <MapPin className="w-5 h-5" />
        ) : (
          <Globe className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Typography
          variant="ui"
          weight="bold"
          color="main"
          className="truncate group-hover:text-brand transition-colors"
        >
          {item.name}
        </Typography>
        <Typography variant="body-sm" color="sec" className="truncate">
          {item.subText}
        </Typography>
      </div>
      {item.type === "EXTERNAL" && (
        <Typography
          variant="micro"
          weight="medium"
          color="brand"
          className="bg-brand/20 px-2 py-1 rounded-full"
        >
          New
        </Typography>
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
          className={cn("input-base pl-11 pr-xl text-p")}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-xl flex items-center">
            <Loader2 className="w-5 h-5 text-brand animate-spin" />
          </div>
        )}
      </div>

      {isOpen && (results.length > 0 || showExternalOption) && (
        <div
          className={cn(
            "absolute top-16 left-0 right-0 bg-surface/90 backdrop-blur-xl border border-border",
            "rounded-3xl shadow-lg overflow-hidden z-dropdown max-h-[60vh] overflow-y-auto",
            "animate-in fade-in zoom-in-95 duration-200",
          )}
        >
          {results.length > 0 && (
            <div className="py-2">
              <Typography
                variant="label-sm"
                weight="bold"
                color="sec"
                className="px-4 py-2 block"
              >
                Destinations
              </Typography>
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
                className={cn(
                  "w-full px-4 py-3 flex items-center justify-between",
                  "hover:bg-brand/10 rounded-xl transition-colors text-left text-brand",
                )}
              >
                <Typography variant="ui-sm" weight="medium">
                  Search globally for &quot;{query}&quot;
                </Typography>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="p-md flex items-center justify-center gap-2 text-secondary">
            <Loader2 className="w-4 h-4 animate-spin" />
            <Typography variant="body-sm" color="sec">
              Searching the globe...
            </Typography>
          </div>

          {results.length === 0 &&
            !showExternalOption &&
            !isLoading &&
            !isExternalLoading && (
              <div className="p-8 text-center">
                <Typography variant="body" color="sec">
                  No results found
                </Typography>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
