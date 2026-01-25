"use client";

import Button from "@/components/atoms/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalItems: number;
  itemsPerPage?: number;
};

interface PaginationProps {
  pagination: PaginationInfo;
  basePath: string;
}

export default function Pagination({ pagination, basePath }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = pagination.itemsPerPage || 20;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${basePath}?${params.toString()}`);
  };

  const startItem = (pagination.currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(
    pagination.currentPage * itemsPerPage,
    pagination.totalItems,
  );

  return (
    <div className="flex items-center justify-between mt-lg pt-lg border-t border-stroke">
      <div className="text-sm text-txt-sec">
        Showing {startItem}-{endItem} of {pagination.totalItems}
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
  );
}
