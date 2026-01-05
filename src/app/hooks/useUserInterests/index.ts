import { useQuery } from "@tanstack/react-query";

// Mock function for user interests
async function getUserInterests(userId: string) {
  // TODO: Replace with actual database call
  return [];
}

// React Query hook to fetch user interests
export function useUserInterests(userId: string) {
  return useQuery({
    queryKey: ["user-interests", userId],
    queryFn: () => getUserInterests(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
