"use server";

import { z } from "zod";
import { createSafeAction } from "@/lib/safe-action";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  denyFriendRequest,
  findFriendshipBetween,
  getFriends,
  getIncomingFriendRequests,
  removeFriend,
  sendFriendRequest,
} from "@/lib/db/friendship.repo";

/* -------------------------------------------------------------------------- */
/*                                FRIEND ACTIONS                               */
/* -------------------------------------------------------------------------- */

export const sendFriendRequestAction = createSafeAction(
  z.object({ targetUserId: z.string() }),
  async (data, userId) => {
    return await sendFriendRequest(userId, data.targetUserId);
  },
);

export const cancelFriendRequestAction = createSafeAction(
  z.object({ targetUserId: z.string() }),
  async (data, userId) => {
    return await cancelFriendRequest(userId, data.targetUserId);
  },
);

export const acceptFriendRequestAction = createSafeAction(
  z.object({ targetUserId: z.string() }),
  async (data, userId) => {
    const friendship = await findFriendshipBetween(userId, data.targetUserId);
    if (!friendship) throw new Error("Friendship not found");
    return await acceptFriendRequest(friendship.id, userId);
  },
);

export const denyFriendRequestAction = createSafeAction(
  z.object({ targetUserId: z.string() }),
  async (data, userId) => {
    const friendship = await findFriendshipBetween(userId, data.targetUserId);
    if (!friendship) throw new Error("Friendship not found");
    return await denyFriendRequest(friendship.id, userId);
  },
);

export const removeFriendAction = createSafeAction(
  z.object({ targetUserId: z.string() }),
  async (data, userId) => {
    return await removeFriend(userId, data.targetUserId);
  },
);

export const getFriendRequestsAction = createSafeAction(
  z.any(),
  async (_, userId) => {
    return await getIncomingFriendRequests(userId);
  },
);

export const getFriendshipStatusAction = createSafeAction(
  z.object({ targetUserId: z.string() }),
  async (data, userId) => {
    const friendship = await findFriendshipBetween(userId, data.targetUserId);
    if (!friendship) return null;
    return {
      status: friendship.status,
      requesterId: friendship.requesterId,
    };
  },
);

/* -------------------------------------------------------------------------- */
/*                                TRAVEL PARTNER                               */
/* -------------------------------------------------------------------------- */

export const getTravelPartnersAction = createSafeAction(
  z.any(),
  async (_, userId) => {
    return await getFriends(userId);
  },
);
