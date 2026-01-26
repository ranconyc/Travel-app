import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getMatesAction } from "./mates.actions";
import { User } from "@/domain/user/user.schema";
import { MatchResult } from "@/domain/match/match.schema";

export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalMates: number;
};

export type MatesResponse = {
  matesWithMatch: (User & { match: MatchResult })[];
  pagination: PaginationInfo;
  meta: {
    isGlobal: boolean;
  };
};

export function useMates(
  page: number = 1,
  initialData?: MatesResponse,
): UseQueryResult<MatesResponse, Error> {
  return useQuery({
    queryKey: ["mates", page],
    queryFn: async () => {
      const res = await getMatesAction({ page });
      if (!res.success) {
        throw new Error(res.error);
      }
      return res.data as MatesResponse;
    },
    initialData: initialData || undefined,
    staleTime: 300000, // 5 minutes
    enabled: true,
  });
}
