import { useQuery } from "@tanstack/react-query";
import { getTravelPartnersAction } from "@/domain/friendship/friendship.actions";

// React Query hook to fetch travel partners
export function useTravelPartners(userId: string) {
  return useQuery({
    queryKey: ["travel-partners", userId],
    queryFn: () => getTravelPartnersAction(),
    enabled: !!userId,
    // Stale time: friends don't change every second. 1-5 minutes is fine.
    staleTime: 1000 * 60 * 5,
  });
}
