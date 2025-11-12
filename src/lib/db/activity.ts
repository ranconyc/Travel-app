import { prisma } from "./prisma";

export async function getActivity(activityId: string) {
  console.log("getCountryWithCities", activityId);
  if (!activityId) return null;
  try {
    return prisma?.activity?.findUnique({
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
    console.log("getCountryWithCities error", error);
    return null;
  }
}

export async function getAllActivities() {
  console.log("getting all activities....");

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
    console.log("getAllLanguages error", error);
    return null;
  }
}
