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
  const result = await sendFriendRequest(requesterId, addresseeId);

  // Side Effect: Notify addressee
  if (result) {
    const { getUserById } = await import("@/lib/db/user.repo");
    const { notificationService } =
      await import("@/domain/notification/notification.service");
    const requester = await getUserById(requesterId);

    await notificationService.createNotification({
      userId: addresseeId,
      type: "FRIEND_REQUEST",
      title: "New Friend Request",
      message: `${requester?.name || "Someone"} sent you a friend request.`,
      data: { requesterId },
    });
  }

  return result;
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

  // Side Effect: Notify the other user
  if (result) {
    const { getUserById } = await import("@/lib/db/user.repo");
    const { notificationService } =
      await import("@/domain/notification/notification.service");
    const user = await getUserById(currentUserId);

    await notificationService.createNotification({
      userId: targetUserId,
      type: "FRIEND_ACCEPT",
      title: "Friend Request Accepted",
      message: `${user?.name || "Someone"} accepted your friend request!`,
      data: { friendId: currentUserId },
    });
  }

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
