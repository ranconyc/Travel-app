import {
  acceptFriendRequest,
  cancelFriendRequest,
  denyFriendRequest,
  findFriendshipBetween,
  removeFriend,
  sendFriendRequest,
} from "@/lib/db/friendship.repo";

export async function requestFriendship(
  requesterId: string,
  addresseeId: string,
) {
  // Any pre-request logic (e.g. check if user is blocked in a separate way, or if they are already friends)
  // The repo already does some of this, but we can add more "service" level logic here.
  return await sendFriendRequest(requesterId, addresseeId);
}

export async function handleCancelRequest(
  requesterId: string,
  targetUserId: string,
) {
  return await cancelFriendRequest(requesterId, targetUserId);
}

export async function handleAcceptRequest(
  currentUserId: string,
  targetUserId: string,
) {
  const friendship = await findFriendshipBetween(currentUserId, targetUserId);
  if (!friendship) {
    throw new Error("Friendship request not found");
  }

  const result = await acceptFriendRequest(friendship.id, currentUserId);

  // Side effect: Notify users, create chat session, etc.
  // if (result) {
  //   await createChat({ participants: [currentUserId, targetUserId] });
  // }

  return result;
}

export async function handleDenyRequest(
  currentUserId: string,
  targetUserId: string,
) {
  const friendship = await findFriendshipBetween(currentUserId, targetUserId);
  if (!friendship) {
    throw new Error("Friendship request not found");
  }

  return await denyFriendRequest(friendship.id, currentUserId);
}

export async function handleRemoveFriend(
  currentUserId: string,
  targetUserId: string,
) {
  return await removeFriend(currentUserId, targetUserId);
}

export async function handleGetIncomingFriendRequests(userId: string) {
  const { getIncomingFriendRequests } =
    await import("@/lib/db/friendship.repo");
  return await getIncomingFriendRequests(userId);
}

export async function handleGetFriendshipStatus(
  userId: string,
  targetUserId: string,
) {
  const friendship = await findFriendshipBetween(userId, targetUserId);
  if (!friendship) return null;
  return {
    status: friendship.status,
    requesterId: friendship.requesterId,
    addresseeId: friendship.addresseeId,
  };
}

export async function handleGetTravelPartners(userId: string) {
  const { getFriends } = await import("@/lib/db/friendship.repo");
  return await getFriends(userId);
}
