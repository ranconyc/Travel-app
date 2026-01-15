"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  denyFriendRequest,
  findFriendshipBetween,
  getFriends,
  removeFriend,
  sendFriendRequest,
} from "@/lib/db/friendship.repo";

/* -------------------------------------------------------------------------- */
/*                                FRIEND ACTIONS                               */
/* -------------------------------------------------------------------------- */

export async function sendFriendRequestAction(
  targetUserId: string,
  currentUserId: string
) {
  const res = await sendFriendRequest(currentUserId, targetUserId);
  return res;
}

export async function cancelFriendRequestAction(
  targetUserId: string,
  currentUserId: string
) {
  const res = await cancelFriendRequest(currentUserId, targetUserId);
  return res;
}

export async function acceptFriendRequestAction(
  targetUserId: string,
  currentUserId: string
) {
  const friendship = await findFriendshipBetween(currentUserId, targetUserId);
  if (!friendship) throw new Error("Friendship not found");

  const res = await acceptFriendRequest(friendship.id, currentUserId);
  return res;
}

export async function denyFriendRequestAction(
  targetUserId: string,
  currentUserId: string
) {
  const friendship = await findFriendshipBetween(currentUserId, targetUserId);
  if (!friendship) throw new Error("Friendship not found");

  const res = await denyFriendRequest(friendship.id, currentUserId);
  return res;
}

export async function removeFriendAction(
  targetUserId: string,
  currentUserId: string
) {
  const res = await removeFriend(currentUserId, targetUserId);
  return res;
}

export async function getFriendshipStatusAction(userA: string, userB: string) {
  const friendship = await findFriendshipBetween(userA, userB);
  if (!friendship) return null;
  return {
    status: friendship.status,
    requesterId: friendship.requesterId,
  };
}

/* -------------------------------------------------------------------------- */
/*                                TRAVEL PARTNER                               */
/* -------------------------------------------------------------------------- */

export async function getTravelPartnersAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return [];
  }

  try {
    return await getFriends(session.user.id);
  } catch (error) {
    console.error("getTravelPartnersAction error:", error);
    return [];
  }
}
