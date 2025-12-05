import { prisma } from "./prisma";

export async function getActivityById(activityId: string) {
  if (!activityId) return null;

  try {
    return await prisma.activity.findUnique({
      where: { activityId },
      select: {
        id: true,
        activityId: true,
        name: true,
        slug: true,
        categories: true,
        address: true,
        amenities: true,
        coords: true,
        timeZone: true,
        neighborhood: true,
        openingHours: true,
        bestTimeToVisit: true,
        typicalVisitDuration: true,
        entryPrice: true,
        images: true,
      },
    });
  } catch (error) {
    console.error("getActivityById error:", error);
    throw new Error("Failed to fetch activity");
  }
}

export async function getAllActivities() {
  try {
    return await prisma.activity.findMany({
      select: {
        id: true,
        activityId: true,
        name: true,
        slug: true,
        categories: true,
        address: true,
        amenities: true,
        coords: true,
        timeZone: true,
        neighborhood: true,
        openingHours: true,
        bestTimeToVisit: true,
        typicalVisitDuration: true,
        entryPrice: true,
        images: true,
      },
    });
  } catch (error) {
    console.error("getAllActivities error:", error);
    throw new Error("Failed to fetch activities");
  }
}
