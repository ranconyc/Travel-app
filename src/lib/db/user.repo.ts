import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";
import { type Coordinates } from "@/domain/common.schema";
import { type NearbyUserResult } from "@/domain/user/user.schema";

import { userFullInclude } from "./prisma.presets";

// Type for user with all related data
export type UserWithRelations = Prisma.UserGetPayload<{
  include: typeof userFullInclude;
}>;

export async function getUserById(
  id: string,
): Promise<UserWithRelations | null> {
  if (!id) return null;
  // Validate MongoDB ObjectId format (24 hex characters)
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    console.warn(`getUserById: Invalid ObjectId format: "${id}"`);
    return null;
  }
  try {
    return await prisma.user.findUnique({
      where: { id },
      include: userFullInclude,
    });
  } catch (error) {
    console.error("getUserById error:", error);
    throw new Error("Failed to fetch user");
  }
}

// get all users
export async function getAllUsers() {
  try {
    return await prisma.user.findMany({
      include: userFullInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("getAllUsers error:", error);
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

export async function getUsersForMatching(userIds: string[]) {
  if (!userIds || userIds.length === 0) return [];

  try {
    return await prisma.user.findMany({
      where: { id: { in: userIds } },
      include: {
        ...userFullInclude,
        cityVisits: {
          include: { city: true },
        },
        friendshipsRequested: true,
        friendshipsReceived: true,
      },
    });
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
export async function updateUserAvatar(userId: string, avatarUrl: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { avatarUrl },
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

/**
 * Updates user geolocation and city reference.
 */
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
