"use server";

import { z } from "zod";
import { createSafeAction } from "@/lib/safe-action";
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
  z.object({ targetUserId: z.string() }),
  async (data, userId) => {
    return await requestFriendship(userId, data.targetUserId);
  },
);

export const cancelFriendRequestAction = createSafeAction(
  z.object({ targetUserId: z.string() }),
  async (data, userId) => {
    return await handleCancelRequest(userId, data.targetUserId);
  },
);

export const acceptFriendRequestAction = createSafeAction(
  z.object({ targetUserId: z.string() }),
  async (data, userId) => {
    return await handleAcceptRequest(userId, data.targetUserId);
  },
);

export const denyFriendRequestAction = createSafeAction(
  z.object({ targetUserId: z.string() }),
  async (data, userId) => {
    return await handleDenyRequest(userId, data.targetUserId);
  },
);

export const removeFriendAction = createSafeAction(
  z.object({ targetUserId: z.string() }),
  async (data, userId) => {
    return await handleRemoveFriend(userId, data.targetUserId);
  },
);

export const getFriendRequestsAction = createSafeAction(
  z.any(),
  async (_, userId) => {
    return await handleGetIncomingFriendRequests(userId);
  },
);

export const getFriendshipStatusAction = createSafeAction(
  z.object({ targetUserId: z.string() }),
  async (data, userId) => {
    return await handleGetFriendshipStatus(userId, data.targetUserId);
  },
);

/* -------------------------------------------------------------------------- */
/*                                TRAVEL PARTNER                               */
/* -------------------------------------------------------------------------- */

export const getTravelPartnersAction = createSafeAction(
  z.any(),
  async (_, userId) => {
    return await handleGetTravelPartners(userId);
  },
);
