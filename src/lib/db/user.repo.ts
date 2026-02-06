import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";
import { type Coordinates } from "@/domain/common.schema";
import { type NearbyUserResult } from "@/domain/user/user.schema";

import {
  userFullInclude,
  userBasicSelect,
  baseUserSelect,
} from "./prisma.presets";

// Type for user with all related data
export type UserWithRelations = Prisma.UserGetPayload<{
  include: typeof userFullInclude;
}>;

// Type for basic user data (minimal)
export type UserBasic = Prisma.UserGetPayload<{
  select: typeof userBasicSelect;
}>;

// Type for base user data (for cards/lists)
export type UserBase = Prisma.UserGetPayload<{
  select: typeof baseUserSelect;
}>;

/**
 * Fetches a user by ID with configurable data fetching strategy.
 *
 * @param id - User ID
 * @param options - Query options
 * @param options.strategy - 'base' for lightweight (card/list views) or 'full' for complete data. Default: 'base'
 * @returns UserBase if strategy is 'base', UserWithRelations if 'full'
 *
 * @example
 * // Lightweight fetch (default) - for cards, lists, avatars
 * const user = await getUserById(userId); // Returns UserBase
 *
 * @example
 * // Full fetch - for profile pages, detailed views
 * const user = await getUserById(userId, { strategy: 'full' }); // Returns UserWithRelations
 */
export async function getUserById(
  id: string,
  options: { strategy?: "base" | "full" } = { strategy: "base" },
): Promise<UserBase | UserWithRelations | null> {
  if (!id) return null;
  // Validate MongoDB ObjectId format (24 hex characters)
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    console.warn(`getUserById: Invalid ObjectId format: "${id}"`);
    return null;
  }
  try {
    if (options.strategy === "full") {
      return await prisma.user.findUnique({
        where: { id },
        include: userFullInclude,
      });
    }
    // Default: lightweight 'base' strategy
    return await prisma.user.findUnique({
      where: { id },
      select: baseUserSelect,
    });
  } catch (error) {
    console.error("getUserById error:", error);
    throw new Error("Failed to fetch user");
  }
}

/**
 * Fetches a user by ID with only basic fields (id, email, name, avatarUrl, profileCompleted).
 * Use this for list views, dropdowns, and when you don't need profile data.
 */
export async function getUserBasicById(id: string): Promise<UserBasic | null> {
  if (!id) return null;
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    console.warn(`getUserBasicById: Invalid ObjectId format: "${id}"`);
    return null;
  }
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: userBasicSelect,
    });
  } catch (error) {
    console.error("getUserBasicById error:", error);
    throw new Error("Failed to fetch user");
  }
}

/**
 * Fetches all users with base fields (optimized for list views).
 * Uses baseUserSelect which includes fields needed for user cards:
 * - id, name, avatarUrl, currentCityId
 * - profile: firstName, lastName, homeBaseCityId
 * - media: avatar image
 *
 * This is FORCED lightweight - perfect for MateCard, user lists, etc.
 *
 * @returns Array of UserBase objects
 */
/**
 * Fetches users with base fields (optimized for list views) with pagination.
 */
export async function getPaginatedUsers(options: {
  take: number;
  skip: number;
  excludeUserId?: string;
}): Promise<UserBase[]> {
  try {
    return await prisma.user.findMany({
      where: {
        id: { not: options.excludeUserId },
        isBanned: false,
        isActive: true,
      },
      select: baseUserSelect,
      take: options.take,
      skip: options.skip,
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("getPaginatedUsers error:", error);
    throw new Error("Unable to fetch users");
  }
}

/**
 * Count active, non-banned users (for pagination).
 * Excludes a specific user ID (typically the logged-in user).
 */
export async function countActiveUsers(
  excludeUserId?: string,
): Promise<number> {
  try {
    return await prisma.user.count({
      where: {
        id: excludeUserId ? { not: excludeUserId } : undefined,
        isBanned: false,
        isActive: true,
      },
    });
  } catch (error) {
    console.error("countActiveUsers error:", error);
    throw new Error("Unable to count users");
  }
}

/**
 * Fetches all users with full relations.
 * Use only when you need complete user data (e.g., admin user management).
 */
export async function getAllUsersFull(): Promise<UserWithRelations[]> {
  try {
    return await prisma.user.findMany({
      include: userFullInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("getAllUsersFull error:", error);
    throw new Error("Unable to fetch users at this time");
  }
}

export async function getNearbyUsers(
  coords: Coordinates,
  km = 50,
): Promise<NearbyUserResult[]> {
  try {
    if (
      !coords ||
      typeof coords.lat !== "number" ||
      typeof coords.lng !== "number"
    ) {
      console.error("getNearbyUsers: invalid coordinates", coords);
      return [];
    }

    if (km > 20000) {
      km = 20000;
    }

    const { lat, lng } = coords;
    const meters = km * 1000;

    const res = await prisma.user.aggregateRaw({
      pipeline: [
        {
          $geoNear: {
            near: { type: "Point", coordinates: [lng, lat] },
            distanceField: "dist_m",
            spherical: true,
            maxDistance: meters,
          },
        },
        {
          $lookup: {
            from: "UserProfile",
            localField: "_id",
            foreignField: "userId",
            as: "profile",
          },
        },
        { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
      ],
    });

    return (res as unknown as Record<string, any>[]).map((row) => ({
      id: row._id?.$oid ?? row._id ?? null,
      firstName: row.profile?.firstName ?? row.firstName ?? null,
      lastName: row.profile?.lastName ?? row.lastName ?? null,
      name: row.name ?? null,
      email: row.email ?? null,
      avatarUrl: row.avatarUrl ?? null,
      birthday: row.profile?.birthday ? new Date(row.profile.birthday) : null,
      gender: row.profile?.gender ?? null,
      occupation: row.profile?.occupation ?? null,
      description: row.profile?.description ?? null,
      languages: row.profile?.languages ?? [],
      homeBaseCityId:
        row.profile?.homeBaseCityId?.$oid ??
        row.profile?.homeBaseCityId ??
        null,
      distanceKm: row.dist_m ? row.dist_m / 1000 : null,
    }));
  } catch (error: any) {
    console.error("getNearbyUsers error:", error);
    return [];
  }
}

export async function isUserExists(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return !!user;
}

export async function deleteUserAccount(userId: string): Promise<void> {
  if (!userId) throw new Error("User ID missing");

  try {
    // 1. Clear lastMessageId in chats where this user sent the last message
    // (To prevent circular reference errors or FK issues depending on DB setup)
    await prisma.chat.updateMany({
      where: {
        lastMessage: {
          senderId: userId,
        },
      },
      data: {
        lastMessageId: null,
      },
    });

    // 2. Delete the user (Cascade should handle profile, media, etc. if configured)
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    console.error("deleteUserAccount error:", error);
    throw new Error("Failed to delete user account");
  }
}

export async function updateVisitedCountries(
  userId: string,
  countries: string[],
): Promise<void> {
  if (!userId) {
    throw new Error("User ID missing");
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        visitedCountries: countries,
      },
    });
  } catch (error) {
    console.error("updateVisitedCountries error:", error);
    throw new Error("Failed to update visited countries");
  }
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(data: {
  email: string;
  name: string;
  passwordHash: string;
  role?: "USER" | "ADMIN";
}) {
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      passwordHash: data.passwordHash,
      role: data.role || "USER",
      visitedCountries: [],
    },
  });
}

export async function getUserRole(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role || null;
}

export async function updateUserRole(userId: string, role: "USER" | "ADMIN") {
  if (!userId) throw new Error("User ID missing");
  return prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}

/**
 * Fetches users for matching algorithm with selective relation loading.
 * By default, uses baseUserSelect for lightweight fetching.
 * Only includes heavy relations (visits, friendships) when explicitly requested.
 *
 * @param userIds - Array of user IDs to fetch
 * @param options - Optional flags for heavy relations
 * @param options.includeVisits - If true, includes cityVisits with city data. Default: false
 * @param options.includeFriendships - If true, includes friendship relations. Default: false
 * @param options.strategy - 'base' for lightweight or 'full' for all relations. Default: 'base'
 * @returns Array of users with selected relations
 *
 * @example
 * // Lightweight (default) - for basic matching
 * const users = await getUsersForMatching(userIds);
 *
 * @example
 * // With visits only
 * const users = await getUsersForMatching(userIds, { includeVisits: true });
 *
 * @example
 * // Full data for complex matching
 * const users = await getUsersForMatching(userIds, { strategy: 'full' });
 */
export async function getUsersForMatching(
  userIds: string[],
  options?: {
    includeVisits?: boolean;
    includeFriendships?: boolean;
    strategy?: "base" | "full";
  },
): Promise<(UserBase | UserWithRelations)[]> {
  if (!userIds || userIds.length === 0) return [];

  const {
    includeVisits = false,
    includeFriendships = false,
    strategy = "base",
  } = options || {};

  try {
    // Full strategy: use include with all relations
    if (strategy === "full") {
      return await prisma.user.findMany({
        where: { id: { in: userIds } },
        include: {
          ...userFullInclude,
          ...(includeVisits && {
            cityVisits: {
              include: { city: true },
            },
          }),
          ...(includeFriendships && {
            friendshipsRequested: true,
            friendshipsReceived: true,
          }),
        },
      });
    }

    // Base strategy: use select with optional relations
    const baseSelect: Prisma.UserSelect = {
      ...baseUserSelect,
      ...(includeVisits && {
        cityVisits: {
          include: { city: true },
        },
      }),
      ...(includeFriendships && {
        friendshipsRequested: {
          select: {
            id: true,
            requesterId: true,
            addresseeId: true,
            status: true,
          },
        },
        friendshipsReceived: {
          select: {
            id: true,
            requesterId: true,
            addresseeId: true,
            status: true,
          },
        },
      }),
    };

    return (await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: baseSelect,
    })) as any as (UserBase | UserWithRelations)[];
  } catch (error) {
    console.error("getUsersForMatching error:", error);
    return [];
  }
}

/**
 * Updates core user and profile data in a single transaction.
 */
export async function updateFullProfile(userId: string, data: any) {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

/**
 * Specifically updates the avatar URL for a user.
 */
export async function updateUserAvatar(
  userId: string,
  avatarUrl: string,
  avatarPublicId?: string,
) {
  return prisma.user.update({
    where: { id: userId },
    data: { avatarUrl, avatarPublicId },
  });
}

/**
 * Merges and updates the user persona.
 */
export async function updateUserPersona(userId: string, persona: any) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      profileCompleted: true,
      profile: {
        upsert: {
          create: { persona },
          update: { persona },
        },
      },
    },
  });
}

export async function updateUserLocation(
  userId: string,
  location: { type: string; coordinates: [number, number] },
  cityId: string,
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      currentLocation: location,
      currentCityId: cityId,
    },
  });
}

/**
 * @deprecated Use getPaginatedUsers or getAllUsersFull instead.
 */
export async function getAllUsers(): Promise<UserBase[]> {
  try {
    return await prisma.user.findMany({
      where: { isBanned: false, isActive: true },
      select: baseUserSelect,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getAllUsers error:", error);
    throw new Error("Unable to fetch users");
  }
}

/**
 * Get latest registered users
 */
export async function findLatestUsers(limit = 5) {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      avatarUrl: true,
    },
  });
}

/**
 * Get users grouped by current city (for trending cities)
 */
export async function getUsersGroupedByCity(limit = 5) {
  return prisma.user.groupBy({
    by: ["currentCityId"],
    where: {
      currentCityId: { not: null },
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: limit,
  });
}

/**
 * Count total users, optionally filtered by update time
 */
export async function countUsers(filter?: { updatedAfter?: Date }) {
  const where: Prisma.UserWhereInput = {};
  if (filter?.updatedAfter) {
    where.updatedAt = { gte: filter.updatedAfter };
  }
  return prisma.user.count({ where });
}

/**
 * Update user with profile upsert (Handling the atomic update structure)
 */
export async function updateUserWithProfile(
  userId: string,
  data: Prisma.UserUpdateInput,
) {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

/**
 * Get user profile with persona
 */
export async function getUserProfile(userId: string) {
  return prisma.userProfile.findUnique({
    where: { userId },
    select: { persona: true },
  });
}
