"use client";

import React, { useState, useRef, memo } from "react";
import { Search, MapPin, Loader2, Globe, ArrowRight } from "lucide-react";
import Typography from "@/components/atoms/Typography";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useCitySearch } from "@/domain/search/search.hooks";
import { SearchResult } from "@/domain/search/search.schema";
import { useClickOutside } from "@/lib/hooks/ui/useClickOutside";
import { motion, AnimatePresence } from "framer-motion";

const searchResultItemVariants = cva(
  "w-full px-4 py-3 flex items-center gap-md transition-all text-left group cursor-pointer rounded-xl",
  {
    variants: {
      variant: {
        default: "hover:bg-brand/5 active:bg-brand/10",
        active: "bg-brand/10",
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

const TRENDING_DESTINATIONS: SearchResult[] = [
  {
    id: "trend-1",
    name: "Tokyo",
    type: "CITY",
    slug: "tokyo",
    subText: "Japan",
    flag: "🇯🇵",
  },
  {
    id: "trend-2",
    name: "Paris",
    type: "CITY",
    slug: "paris",
    subText: "France",
    flag: "🇫🇷",
  },
  {
    id: "trend-3",
    name: "New York",
    type: "CITY",
    slug: "new-york",
    subText: "USA",
    flag: "🇺🇸",
  },
];

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
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
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
          "group-hover:scale-110 transition-transform duration-300",
        )}
      >
        {item.flag ? (
          <span className="text-2xl">{item.flag}</span>
        ) : item.type === "CITY" ? (
          <MapPin className="w-5 h-5 text-brand" />
        ) : (
          <Globe className="w-5 h-5 text-blue-400" />
        )}
      </div>
      <div className="flex-1 min-w-0 ml-1">
        <Typography
          variant="ui"
          weight="bold"
          color="main"
          className="truncate group-hover:text-brand transition-colors"
        >
          {item.name}
        </Typography>
        <Typography
          variant="body-sm"
          color="sec"
          className="truncate opacity-70"
        >
          {item.subText}
        </Typography>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="w-4 h-4 text-brand" />
      </div>
      {item.type === "EXTERNAL" && (
        <div className="bg-brand/10 text-brand text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ml-2">
          New
        </div>
      )}
    </motion.button>
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

  // Enhanced handleSelect that closes dropdown
  const handleSelectAndClose = (item: SearchResult, index: number) => {
    handleSelect(item, index);
    setIsOpen(false);
  };

  const showList =
    isOpen && (results.length > 0 || showExternalOption || query === "");

  return (
    <div ref={containerRef} className="relative w-full flex flex-col">
      <div className="relative group w-full">
        <div className="absolute inset-y-0 left-md flex items-center pointer-events-none z-10 pl-1">
          <Search
            className={cn(
              "w-5 h-5 transition-all duration-300",
              isOpen
                ? "text-brand scale-110"
                : "text-secondary group-focus-within:text-brand",
            )}
          />
        </div>
        <input
          id="home-search"
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destination..."
          className={cn(
            "input-base pl-xxl pr-xl text-p transition-all duration-300",
            isOpen && "shadow-xl border-brand/50 ring-4 ring-brand/5",
          )}
        />
        {(isLoading || isExternalLoading) && (
          <div className="absolute inset-y-0 right-xl flex items-center">
            <Loader2 className="w-5 h-5 text-brand animate-spin" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute top-[calc(100%+12px)] left-0 right-0 max-h-[70vh] overflow-y-auto",
              "bg-surface/80 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl z-dropdown",
              "scrollbar-hide p-2 flex flex-col gap-1",
            )}
          >
            {query === "" ? (
              <div className="py-2">
                <div className="px-4 py-2 flex items-center justify-between">
                  <Typography
                    variant="label-sm"
                    weight="bold"
                    color="sec"
                    className="uppercase tracking-widest text-[10px]"
                  >
                    Trending Destinations
                  </Typography>
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                </div>
                {TRENDING_DESTINATIONS.map((item, index) => (
                  <SearchResultItem
                    key={item.id}
                    item={item}
                    index={index}
                    onClick={handleSelectAndClose}
                  />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                <Typography
                  variant="label-sm"
                  weight="bold"
                  color="sec"
                  className="px-4 py-2 uppercase tracking-widest text-[10px]"
                >
                  Search Results
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
            ) : null}

            {showExternalOption &&
              !isLoading &&
              !isExternalLoading &&
              query !== "" && (
                <div className="mt-1 pb-1">
                  <button
                    onClick={handleExternalSearch}
                    className={cn(
                      "w-full px-4 py-4 flex items-center justify-between",
                      "bg-brand/5 hover:bg-brand/10 rounded-2xl transition-all text-left text-brand group/ext",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand/10 rounded-lg group-hover/ext:rotate-12 transition-transform">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <Typography variant="ui-sm" weight="bold">
                          Search globally for &quot;{query}&quot;
                        </Typography>
                        <Typography
                          variant="micro"
                          color="brand"
                          className="opacity-70"
                        >
                          Explore data from 200+ countries
                        </Typography>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover/ext:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

            {results.length === 0 &&
              !showExternalOption &&
              !isLoading &&
              !isExternalLoading &&
              query !== "" && (
                <div className="p-12 text-center flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-surface-secondary rounded-full flex items-center justify-center mb-2">
                    <Search className="w-6 h-6 text-txt-muted" />
                  </div>
                  <Typography variant="ui" weight="bold" color="main">
                    No destinations found
                  </Typography>
                  <Typography
                    variant="body-sm"
                    color="sec"
                    className="max-w-[200px]"
                  >
                    Try searching for a city, country or landmark.
                  </Typography>
                </div>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
