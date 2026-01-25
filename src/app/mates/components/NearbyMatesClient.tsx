"use client";

import MateCard from "@/components/molecules/MateCard";
import { User } from "@/domain/user/user.schema";
import PageHeader from "@/components/molecules/PageHeader";
import { useDiscovery } from "@/domain/discovery/discovery.hooks";
import GenderToggle from "@/components/molecules/GenderToggle";
import EmptyState from "@/components/atoms/EmptyState";
import DiscoveryLayout from "@/components/molecules/DiscoveryLayout";
import { ErrorBoundary } from "@/components/atoms/ErrorBoundary";
import Button from "@/components/atoms/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalMates: number;
};

export default function NearbyMatesClient({
  mates,
  loggedUser,
  pagination,
}: {
  mates: User[];
  loggedUser: User;
  pagination: PaginationInfo;
}) {
  const { filters, filteredMates, updateFilters } = useDiscovery(mates);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/mates?${params.toString()}`);
  };

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
        {/* {userList && <div className="">{userList}</div>} */}
        {filteredMates.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-sm">
            {filteredMates.map((mate) => (
              <MateCard
                key={mate.id}
                mate={mate}
                loggedUser={loggedUser}
                priority={false}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No mates found"
            description="Try adjusting your filters to find more travel partners."
            icon={<span>🔍</span>}
          />
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-lg pt-lg border-t border-stroke">
            <div className="text-sm text-txt-sec">
              Showing {((pagination.currentPage - 1) * 20) + 1}-
              {Math.min(pagination.currentPage * 20, pagination.totalMates)} of{" "}
              {pagination.totalMates} mates
            </div>
            <div className="flex items-center gap-sm">
              <Button
                variant="secondary"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
              <span className="text-sm text-txt-sec px-2">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </DiscoveryLayout>
    </ErrorBoundary>
  );
}
