import { prisma } from "@/lib/db/prisma";

/**
 * Get the user's active city visit (where endDate is null)
 */
export async function getActiveVisit(userId: string) {
  try {
    return await prisma.cityVisit.findFirst({
      where: {
        userId,
        endDate: null,
      },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });
  } catch (error) {
    console.error("getActiveVisit error:", error);
    throw new Error("Failed to get active visit");
  }
}

/**
 * Get user's travel history, ordered by most recent first
 */
export async function getUserTravelHistory(
  userId: string,
  options?: {
    limit?: number;
    includeActive?: boolean;
  },
) {
  const limit = options?.limit ?? 50;
  const includeActive = options?.includeActive ?? true;

  try {
    return await prisma.cityVisit.findMany({
      where: {
        userId,
        ...(includeActive ? {} : { endDate: { not: null } }),
      },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
      take: limit,
    });
  } catch (error) {
    console.error("getUserTravelHistory error:", error);
    throw new Error("Failed to get travel history");
  }
}

/**
 * Create a new city visit
 */
export async function createCityVisit(
  userId: string,
  cityId: string,
  coords?: { lat: number; lng: number },
) {
  try {
    const entryCoords = coords
      ? {
          type: "Point",
          coordinates: [coords.lng, coords.lat],
        }
      : undefined;

    return await prisma.cityVisit.create({
      data: {
        userId,
        cityId,
        entryCoords,
      },
      include: {
        city: true,
      },
    });
  } catch (error) {
    console.error("createCityVisit error:", error);
    throw new Error("Failed to create city visit");
  }
}

/**
 * Close a city visit by setting the endDate
 */
export async function closeCityVisit(
  visitId: string,
  coords?: { lat: number; lng: number },
) {
  try {
    const exitCoords = coords
      ? {
          type: "Point",
          coordinates: [coords.lng, coords.lat],
        }
      : undefined;

    return await prisma.cityVisit.update({
      where: { id: visitId },
      data: {
        endDate: new Date(),
        exitCoords,
      },
    });
  } catch (error) {
    console.error("closeCityVisit error:", error);
    throw new Error("Failed to close city visit");
  }
}

/**
 * Get city visits for a specific city
 */
export async function getCityVisits(cityId: string, limit = 20) {
  try {
    return await prisma.cityVisit.findMany({
      where: { cityId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
      take: limit,
    });
  } catch (error) {
    console.error("getCityVisits error:", error);
    throw new Error("Failed to get city visits");
  }
}
