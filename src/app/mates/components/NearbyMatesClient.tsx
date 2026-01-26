"use client";

import MateCard from "@/components/molecules/MateCard";
import { User } from "@/domain/user/user.schema";
import PageHeader from "@/components/molecules/PageHeader";
import { useDiscovery } from "@/domain/discovery/discovery.hooks";
import GenderToggle from "@/components/molecules/GenderToggle";
import EmptyState from "@/components/atoms/EmptyState";
import DiscoveryLayout from "@/components/molecules/DiscoveryLayout";
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

export default function NearbyMatesClient({
  mates: initialMates,
  loggedUser,
  pagination: initialPagination,
}: {
  mates: (User & { match: MatchResult })[];
  loggedUser: User;
  pagination: PaginationInfo;
}) {
  const { data } = useMates(initialPagination.currentPage, {
    matesWithMatch: initialMates,
    pagination: initialPagination,
  });

  const matesWithMatch = (data?.matesWithMatch || initialMates) as User[];
  const pagination = (data?.pagination || initialPagination) as PaginationInfo;

  const { filters, filteredMates, updateFilters } =
    useDiscovery(matesWithMatch);

  return (
    <ErrorBoundary componentName="Mates List">
      <DiscoveryLayout
        header={
          <PageHeader
            subtitle={!loggedUser.currentCity?.name || "Worldwide"}
            title="Mates"
            rightContent={
              <GenderToggle
                gender={filters.gender}
                setGender={(gender) => updateFilters({ gender })}
              />
            }
            backButton={false}
          />
        }
      >
        {filteredMates.length > 0 ? (
          <Block className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-sm">
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
          <EmptyState
            title="No mates found"
            description="Try adjusting your filters to find more travel partners."
            icon={
              <Typography variant="tiny" as="span">
                🔍
              </Typography>
            }
          />
        )}

        {pagination.totalPages > 1 && (
          <Pagination
            pagination={{
              ...pagination,
              totalItems: pagination.totalMates,
            }}
            basePath="/mates"
          />
        )}
      </DiscoveryLayout>
    </ErrorBoundary>
  );
}
