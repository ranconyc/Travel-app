"use client";

import { getFriendshipStatusAction } from "@/domain/friendship/friendship.actions";
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
      const res = await getFriendshipStatusAction({ targetUserId: userB });
      if (!res.success) {
        throw new Error(res.error || "Failed to retrieve friendship status.");
      }
      if (!res.data) return { status: "NONE" }; // This case means success but no data, which implies no friendship found.
      return {
        status: res.data.status as FriendshipStatus,
        requesterId: res.data.requesterId,
      };
    },

    staleTime: 1000 * 10, // 10 seconds — cheap check
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}
