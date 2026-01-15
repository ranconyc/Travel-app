import { prisma } from "./prisma";

export async function getPlaceBySlug(slug: string) {
  if (!slug) return null;

  try {
    return await prisma.place.findUnique({
      where: { slug },
      include: {
        media: true,
        city: {
          include: {
            country: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("getPlaceBySlug error:", error);
    throw new Error("Failed to fetch place");
  }
}

export async function getAllPlaces() {
  try {
    return await prisma.place.findMany({
      include: {
        media: true,
      },
    });
  } catch (error) {
    console.error("getAllPlaces error:", error);
    throw new Error("Failed to fetch places");
  }
}

export async function createPlace(data: any) {
  try {
    return await prisma.place.create({
      data,
    });
  } catch (error) {
    console.error("createPlace error:", error);
    throw new Error("Failed to create place");
  }
}
