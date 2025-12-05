"use server";

import { getFriendshipStatus } from "@/lib/db/friendship.repo";

export async function getFriendshipStatusAction(userA: string, userB: string) {
  return getFriendshipStatus(userA, userB);
}
