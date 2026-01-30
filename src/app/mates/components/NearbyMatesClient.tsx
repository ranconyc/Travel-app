"use client";

import { useMemo, useCallback, useRef, useEffect, useState } from "react";
import MateCard from "@/components/molecules/MateCard";
import { User } from "@/domain/user/user.schema";
import PageNavigation from "@/components/molecules/PageNavigation";
import { useDiscovery } from "@/domain/discovery/discovery.hooks";
import { MateFilters } from "@/domain/discovery/discovery.service";
import NoMatesFound from "@/components/molecules/NoMatesFound";
import MatesFilterPanel, {
  FilterToggleButton,
} from "@/components/molecules/MatesFilterPanel";
import { ErrorBoundary } from "@/components/atoms/ErrorBoundary";
import Pagination from "@/components/molecules/Pagination";
import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";
import { useMates } from "@/domain/mates/mates.hooks";
import { MatchResult } from "@/domain/match/match.schema";

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalMates: number;
};

// Debounce utility
function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
}

export default function NearbyMatesClient({
  mates: initialMates,
  loggedUser,
  pagination: initialPagination,
}: {
  mates: (User & { match: MatchResult })[];
  loggedUser: User;
  pagination: PaginationInfo;
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data } = useMates(initialPagination.currentPage, {
    matesWithMatch: initialMates as (User & { match: MatchResult })[],
    pagination: initialPagination,
    meta: { isGlobal: true },
  });

  const matesWithMatch = (data?.matesWithMatch || initialMates) as (User & {
    match: MatchResult;
  })[];
  const pagination = (data?.pagination || initialPagination) as PaginationInfo;
  const isGlobal = data?.meta?.isGlobal ?? true;

  const { filters, filteredMates, updateFilters, resetFilters } =
    useDiscovery(matesWithMatch);

  // Debounced update for search/filters (500ms)
  const debouncedUpdateRef = useRef(
    debounce((update: Partial<MateFilters>) => {
      updateFilters(update);
    }, 500),
  );

  // Keep ref updated
  useEffect(() => {
    debouncedUpdateRef.current = debounce((update: Partial<MateFilters>) => {
      updateFilters(update);
    }, 500);
  }, [updateFilters]);

  const handleDebouncedUpdate = useCallback(
    (update: Partial<MateFilters>) => {
      // Debounce search, apply other filters immediately
      if ("search" in update) {
        debouncedUpdateRef.current(update);
      } else {
        updateFilters(update);
      }
    },
    [updateFilters],
  );

  // Check if filters are active (non-default)
  const hasActiveFilters = useMemo(() => {
    return (
      filters.gender !== "NON_BINARY" ||
      filters.ageRange.min !== 18 ||
      filters.ageRange.max !== 100 ||
      filters.interests.length > 0 ||
      filters.search !== ""
    );
  }, [filters]);

  return (
    <ErrorBoundary componentName="Mates List">
      {/* Page Navigation with Filter Button */}
      <PageNavigation
        showBack={false}
        title="Mates"
        locationName={
          isGlobal
            ? "Global Suggestions"
            : loggedUser.currentCity?.name || "Nearby"
        }
        rightContent={
          <FilterToggleButton
            onClick={() => setIsFilterOpen(true)}
            hasActiveFilters={hasActiveFilters}
          />
        }
      />

      <div className="flex gap-6 px-md">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="py-4">
            <Typography variant="h2" className="mb-1">
              Find Travel Mates
            </Typography>
            <Typography variant="p" className="text-txt-sec">
              {filteredMates.length} travelers{" "}
              {hasActiveFilters ? "matching filters" : "available"}
            </Typography>
          </div>

          <div className="mt-2">
            {filteredMates.length > 0 ? (
              <Block className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-sm">
                {filteredMates.map((mate) => (
                  <MateCard
                    key={mate.id}
                    mate={mate}
                    loggedUser={loggedUser}
                    priority={false}
                  />
                ))}
              </Block>
            ) : (
              <NoMatesFound
                onClearFilters={resetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            )}

            {pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  pagination={{
                    ...pagination,
                    totalItems: pagination.totalMates,
                  }}
                  basePath="/mates"
                />
              </div>
            )}
          </div>
        </div>

        {/* Filter Panel (Desktop: Right Side / Mobile: Bottom Sheet) */}
        <MatesFilterPanel
          filters={filters}
          onUpdateFilters={handleDebouncedUpdate}
          onResetFilters={resetFilters}
          isOpen={isFilterOpen}
          onOpenChange={setIsFilterOpen}
        />
      </div>
    </ErrorBoundary>
  );
}
