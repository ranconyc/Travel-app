"use server";

import { z } from "zod";
import { createSafeAction } from "@/lib/safe-action";
import { FriendshipTargetSchema } from "./friendship.schema";
import {
  requestFriendship,
  handleAcceptRequest,
  handleCancelRequest,
  handleDenyRequest,
  handleRemoveFriend,
  handleGetIncomingFriendRequests,
  handleGetFriendshipStatus,
  handleGetTravelPartners,
} from "./friendship.service";

/* -------------------------------------------------------------------------- */
/*                                FRIEND ACTIONS                               */
/* -------------------------------------------------------------------------- */

export const sendFriendRequestAction = createSafeAction(
  FriendshipTargetSchema,
  async (data, userId) => {
    return await requestFriendship(userId, data.targetUserId);
  },
);

export const cancelFriendRequestAction = createSafeAction(
  FriendshipTargetSchema,
  async (data, userId) => {
    return await handleCancelRequest(userId, data.targetUserId);
  },
);

export const acceptFriendRequestAction = createSafeAction(
  FriendshipTargetSchema,
  async (data, userId) => {
    return await handleAcceptRequest(userId, data.targetUserId);
  },
);

export const denyFriendRequestAction = createSafeAction(
  FriendshipTargetSchema,
  async (data, userId) => {
    return await handleDenyRequest(userId, data.targetUserId);
  },
);

export const removeFriendAction = createSafeAction(
  FriendshipTargetSchema,
  async (data, userId) => {
    return await handleRemoveFriend(userId, data.targetUserId);
  },
);

export const getFriendRequestsAction = createSafeAction(
  z.object({}).optional(),
  async (_, userId) => {
    return await handleGetIncomingFriendRequests(userId);
  },
);

export const getFriendshipStatusAction = createSafeAction(
  FriendshipTargetSchema,
  async (data, userId) => {
    return await handleGetFriendshipStatus(userId, data.targetUserId);
  },
);

/* -------------------------------------------------------------------------- */
/*                                TRAVEL PARTNER                               */
/* -------------------------------------------------------------------------- */

export const getTravelPartnersAction = createSafeAction(
  z.object({}).optional(),
  async (_, userId) => {
    return await handleGetTravelPartners(userId);
  },
);
