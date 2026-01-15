import { prisma } from "./prisma";
import type { Coordinates, NearbyUserResult } from "@/types/user";
import { CompleteProfileFormValues } from "@/domain/user/completeProfile.schema";

export async function getUserById(id: string) {
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
        images: true,
        currentCity: {
          include: {
            country: true,
          },
        },
        trips: {
          select: {
            startDate: true,
            endDate: true,
            id: true,
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

    // Legacy image update if present in form but not yet moved to UserMedia domain
    if (data.image) {
      await prisma.user.update({
        where: { id: userId },
        data: { image: data.image },
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
        images: true,
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
      image: row.image ?? null,
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

export async function saveUserInterests(
  userId: string,
  data: {
    interests: string[];
    dailyRhythm: string;
    travelStyle: string;
  }
): Promise<void> {
  if (!userId) {
    throw new Error("User ID missing");
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: {
              persona: {
                interests: data.interests,
                dailyRhythm: data.dailyRhythm,
                travelStyle: data.travelStyle,
              },
            },
            update: {
              persona: {
                interests: data.interests,
                dailyRhythm: data.dailyRhythm,
                travelStyle: data.travelStyle,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("saveUserInterests error:", error);
    throw new Error("Failed to save user interests");
  }
}
