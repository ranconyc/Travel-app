import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";
import type { Coordinates, NearbyUserResult } from "@/types/user";
import { CompleteProfileFormValues } from "@/domain/user/completeProfile.schema";

// Type for user with all related data
export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    profile: {
      include: {
        homeBaseCity: {
          include: {
            country: true;
          };
        };
      };
    };
    media: true;
    currentCity: {
      include: {
        country: true;
      };
    };
  };
}>;

export async function getUserById(
  id: string
): Promise<UserWithRelations | null> {
  if (!id) return null;
  try {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            homeBaseCity: {
              include: {
                country: true,
              },
            },
          },
        },
        media: true,
        currentCity: {
          include: {
            country: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("getUserById error:", error);
    throw new Error("Failed to fetch user");
  }
}

export async function completeProfile(
  userId: string,
  data: CompleteProfileFormValues
): Promise<void> {
  if (!userId) {
    throw new Error("User ID missing");
  }

  const birthdayDate =
    data.birthday && data.birthday.length > 0 ? new Date(data.birthday) : null;

  const genderEnum =
    data.gender === ""
      ? null
      : (data.gender as "MALE" | "FEMALE" | "NON_BINARY");

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        profileCompleted: true,
        name: `${data.firstName} ${data.lastName}`.trim(),
        profile: {
          upsert: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName || null,
              birthday: birthdayDate,
              gender: genderEnum,
              occupation: data.occupation || null,
              homeBaseCityId: data.homeBaseCityId,
              languages: data.languages,
            },
            update: {
              firstName: data.firstName,
              lastName: data.lastName || null,
              birthday: birthdayDate,
              gender: genderEnum,
              occupation: data.occupation || null,
              homeBaseCityId: data.homeBaseCityId,
              languages: data.languages,
            },
          },
        },
      },
    });

    // Unified avatar update
    if (data.image) {
      await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: data.image },
      });
    }
  } catch (error) {
    console.error("completeProfile error:", error);
    throw new Error("Failed to update profile");
  }
}

export async function getAllUsers() {
  try {
    return await prisma.user.findMany({
      include: {
        profile: {
          include: {
            homeBaseCity: {
              include: {
                country: true,
              },
            },
          },
        },
        media: true,
        currentCity: {
          include: {
            country: true,
          },
        },
      },
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
  limit = 50
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

    return (res as unknown as any[]).map((row) => ({
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

export async function updateUserProfilePersona(
  userId: string,
  newPersonaData: Record<string, any>
): Promise<void> {
  if (!userId) {
    throw new Error("User ID missing");
  }

  try {
    // 1. Fetch existing persona to merge
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { persona: true },
    });

    const existingPersona = (userProfile?.persona as Record<string, any>) || {};
    const mergedPersona = { ...existingPersona, ...newPersonaData };

    // 2. Update with merged data
    await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: {
              persona: mergedPersona,
            },
            update: {
              persona: mergedPersona,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("updateUserProfilePersona error:", error);
    throw new Error("Failed to update user persona");
  }
}

export async function saveUserInterests(
  userId: string,
  data: {
    interests: string[];
    dailyRhythm: string;
    travelStyle: string;
  }
): Promise<void> {
  return updateUserProfilePersona(userId, data);
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
  countries: string[]
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
