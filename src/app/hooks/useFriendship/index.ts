"use client";

import { getFriendshipStatusAction } from "@/app/profile/actions/getFriendshipStatusAction";
import { useQuery } from "@tanstack/react-query";

export type FriendshipStatus =
  | "NONE"
  | "PENDING"
  | "ACCEPTED"
  | "DENIED"
  | "BLOCKED";

export function useFriendshipStatus(userA: string, userB: string) {
  return useQuery<FriendshipStatus>({
    queryKey: ["friendship-status", userA, userB],

    queryFn: async () => {
      if (!userA || !userB) return "NONE";
      return await getFriendshipStatusAction(userA, userB);
    },

    staleTime: 1000 * 10, // 10 seconds — cheap check
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}
