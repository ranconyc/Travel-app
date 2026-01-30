import { prisma } from "@/lib/db/prisma";
import { placeFullInclude } from "./prisma.presets";

export async function getPlaceBySlug(slug: string) {
  if (!slug) return null;

  try {
    return await prisma.place.findUnique({
      where: { slug },
      include: placeFullInclude,
    });
  } catch (error) {
    console.error("getPlaceBySlug error:", error);
    throw new Error("Failed to fetch place");
  }
}

export async function getAllPlaces(limit?: number, offset?: number) {
  try {
    return await prisma.place.findMany({
      take: limit,
      skip: offset,
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

export async function updatePlace(id: string, data: any) {
  try {
    return await prisma.place.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("updatePlace error:", error);
    throw new Error("Failed to update place");
  }
}

export async function deletePlace(id: string) {
  try {
    return await prisma.place.delete({
      where: { id },
    });
  } catch (error) {
    console.error("deletePlace error:", error);
    throw new Error("Failed to delete place");
  }
}
