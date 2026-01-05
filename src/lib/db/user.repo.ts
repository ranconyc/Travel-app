import { prisma } from "./prisma";
import type { Coordinates, NearbyUserResult } from "@/types/user";
import { CompleteProfileFormValues } from "@/domain/user/completeProfile.schema";

export async function getUserById(id: string) {
  if (!id) return null;
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        currentLocation: true,
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        image: true,
        birthday: true,
        gender: true,
        occupation: true,
        description: true,
        homeBaseCityId: true,
        profileCompleted: true,
        languages: true,
        homeBaseCity: {
          select: {
            id: true,
            name: true,
            country: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        currentCityId: true,
        currentCity: {
          select: {
            id: true,
            name: true,
            country: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        trips: {
          select: {
            startDate: true,
            endDate: true,
            id: true,
          },
        },
        interests: {
          select: {
            interest: {
              select: {
                id: true,
                label: true,
                slug: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
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

  const imageValue =
    data.image === "" || data.image === null ? undefined : data.image;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName || null,
        birthday: birthdayDate,
        gender: genderEnum,
        occupation: data.occupation || null,
        description: undefined, // leave untouched
        image: imageValue,
        // TODO: homeBaseCityId + languages update if needed
        homeBaseCityId: data.homeBaseCityId,
        languages: data.languages,
      },
    });
  } catch (error) {
    console.error("completeProfile error:", error);
    throw new Error("Failed to update profile");
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        image: true,
        birthday: true,
        gender: true,
        occupation: true,
        description: true,
        languages: true,
        homeBaseCityId: true,
        homeBaseCity: {
          select: {
            id: true,
            name: true,
            country: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        currentCityId: true,
        currentCity: {
          select: {
            id: true,
            name: true,
            country: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
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

    // Protect MongoDB: earth radius ≈ 6371km → absolute max ~20k
    if (km > 20000) {
      console.warn(`km value too large (${km}), clamping to 20000`);
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
        // ... other stages ...
      ],
    });

    return (res as any[]).map((row) => ({
      id: row._id?.$oid ?? null,
      firstName: row.firstName ?? null,
      distanceKm: row.dist_m ? row.dist_m / 1000 : null,
    }));
  } catch (error: any) {
    console.error("getNearbyUsers error:", {
      message: error?.message,
      stack: error?.stack,
      coords,
      km,
      limit,
    });

    return [];
  }
}

export async function isUserExists(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return !!user;
}
