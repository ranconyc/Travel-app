"use server";

import { sendFriendRequest } from "@/lib/db/friendship.repo";

export async function sendFriendRequestAction(
  targetUserId: string,
  currentUserId: string
) {
  return await sendFriendRequest(currentUserId, targetUserId);
}
