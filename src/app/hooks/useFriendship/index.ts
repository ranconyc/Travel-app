"use client";

import { getFriendshipStatusAction } from "@/app/profile/actions/friendship.actions";
import { useQuery } from "@tanstack/react-query";

export type FriendshipStatus =
  | "NONE"
  | "PENDING"
  | "ACCEPTED"
  | "DENIED"
  | "BLOCKED";

export type FriendshipData = {
  status: FriendshipStatus;
  requesterId?: string;
};

export function useFriendshipStatus(userA: string, userB: string) {
  return useQuery<FriendshipData>({
    queryKey: ["friendship-status", userA, userB],

    queryFn: async () => {
      if (!userA || !userB) return { status: "NONE" };
      const res = await getFriendshipStatusAction(userA, userB);
      if (!res) return { status: "NONE" };
      return {
        status: res.status,
        requesterId: res.requesterId,
      };
    },

    staleTime: 1000 * 10, // 10 seconds — cheap check
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}
