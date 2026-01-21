import { prisma } from "@/lib/db/prisma";
import { FriendStatus } from "@prisma/client";
import { baseUserSelect } from "./prisma.presets";

/**
 * Find relationship between two users in ANY direction.
 * This is helpful for checking status, block, etc.
 */
export async function findFriendshipBetween(userA: string, userB: string) {
  return prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: userA, addresseeId: userB },
        { requesterId: userB, addresseeId: userA },
      ],
    },
  });
}

/**
 * Send a friend request (A → B)
 */
export async function sendFriendRequest(
  requesterId: string,
  addresseeId: string,
) {
  if (requesterId === addresseeId) throw new Error("Cannot friend yourself");

  const existing = await findFriendshipBetween(requesterId, addresseeId);

  // console.log("sending Friend Request...", existing);

  // If there's already a relationship, handle depending on the state
  if (existing) {
    if (existing.status === FriendStatus.BLOCKED) {
      throw new Error("Friendship is blocked");
    }
    if (existing.status === FriendStatus.ACCEPTED) {
      return existing;
    }
    if (existing.status === FriendStatus.PENDING) {
      return existing; // Already pending
    }

    // If DENIED → re-open request
    return prisma.friendship.update({
      where: { id: existing.id },
      data: {
        requesterId,
        addresseeId,
        status: FriendStatus.PENDING,
        blockedById: null,
      },
    });
  }

  return prisma.friendship.create({
    data: {
      requesterId,
      addresseeId,
      status: FriendStatus.PENDING,
    },
  });
}

/**
 * Get friendship status between two users.
 * Returns one of: FriendStatus | "NONE"
 */
export async function getFriendshipStatus(
  userA: string,
  userB: string,
): Promise<FriendStatus | "NONE"> {
  const friendship = await findFriendshipBetween(userA, userB);
  return friendship?.status ?? "NONE";
}

/**
 * Accept friend request (only addressee can accept)
 */
export async function acceptFriendRequest(
  friendshipId: string,
  currentUserId: string,
) {
  const request = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!request) throw new Error("Request not found");
  if (request.addresseeId !== currentUserId) {
    throw new Error("Not allowed to accept");
  }
  if (request.status !== FriendStatus.PENDING) {
    throw new Error("Request is not pending");
  }

  return prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: FriendStatus.ACCEPTED },
  });
}

/**
 * Deny a friend request (only addressee can deny)
 */
export async function denyFriendRequest(
  friendshipId: string,
  currentUserId: string,
) {
  const request = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!request) throw new Error("Request not found");
  if (request.addresseeId !== currentUserId) {
    throw new Error("Not allowed to deny");
  }

  return prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: FriendStatus.DENIED },
  });
}

/**
 * Remove an existing friend
 * (either side can unfriend)
 */
export async function removeFriend(userA: string, userB: string) {
  const existing = await findFriendshipBetween(userA, userB);

  if (!existing) return null;

  if (existing.status !== FriendStatus.ACCEPTED) {
    throw new Error("Not friends");
  }

  return prisma.friendship.delete({
    where: { id: existing.id },
  });
}

/**
 * Cancel a pending friend request (only requester can cancel)
 */
export async function cancelFriendRequest(
  requesterId: string,
  addresseeId: string,
) {
  const existing = await findFriendshipBetween(requesterId, addresseeId);

  if (!existing) return null;

  if (existing.status !== FriendStatus.PENDING) {
    throw new Error("Request is not pending");
  }

  if (existing.requesterId !== requesterId) {
    throw new Error("You did not send this request");
  }

  return prisma.friendship.delete({
    where: { id: existing.id },
  });
}

/**
 * Block user (either direction)
 */
export async function blockUser(blockerId: string, otherUserId: string) {
  if (blockerId === otherUserId) throw new Error("Cannot block yourself");

  const existing = await findFriendshipBetween(blockerId, otherUserId);

  if (existing) {
    return prisma.friendship.update({
      where: { id: existing.id },
      data: {
        status: FriendStatus.BLOCKED,
        blockedById: blockerId,
      },
    });
  }

  return prisma.friendship.create({
    data: {
      requesterId: blockerId,
      addresseeId: otherUserId,
      status: FriendStatus.BLOCKED,
      blockedById: blockerId,
    },
  });
}

/**
 * Unblock user
 */
export async function unblockUser(blockerId: string, otherUserId: string) {
  const existing = await findFriendshipBetween(blockerId, otherUserId);
  if (!existing) throw new Error("Relationship not found");

  if (existing.status !== FriendStatus.BLOCKED) {
    throw new Error("User is not blocked");
  }
  if (existing.blockedById !== blockerId) {
    throw new Error("You did not block this user");
  }

  // After unblock, relationship resets to DENIED (not friends)
  return prisma.friendship.update({
    where: { id: existing.id },
    data: {
      status: FriendStatus.DENIED,
      blockedById: null,
    },
  });
}

/**
 * Get all accepted friends for a user
 */
export async function getFriends(userId: string) {
  const rows = await prisma.friendship.findMany({
    where: {
      status: FriendStatus.ACCEPTED,
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    include: {
      requester: {
        select: baseUserSelect,
      },
      addressee: {
        select: baseUserSelect,
      },
    },
  });

  return rows.map((row) => {
    const friend = row.requesterId === userId ? row.addressee : row.requester;
    const mainImage =
      friend.media?.find((img) => img.category === "AVATAR")?.url ||
      friend.avatarUrl;

    return {
      id: friend.id,
      firstName: friend.profile?.firstName || "",
      lastName: friend.profile?.lastName || "",
      profilePicture: mainImage,
      homeBaseCity: friend.profile?.homeBaseCity,
    };
  });
}

/**
 * Get incoming pending friend requests (other users → me)
 */
export async function getIncomingFriendRequests(userId: string) {
  return prisma.friendship.findMany({
    where: {
      addresseeId: userId,
      status: FriendStatus.PENDING,
    },
    include: {
      requester: true,
    },
  });
}

/**
 * Get outgoing pending friend requests (me → other users)
 */
export async function getOutgoingFriendRequests(userId: string) {
  return prisma.friendship.findMany({
    where: {
      requesterId: userId,
      status: FriendStatus.PENDING,
    },
    include: {
      addressee: true,
    },
  });
}
