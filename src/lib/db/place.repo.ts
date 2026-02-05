import { prisma } from "@/lib/db/prisma";
import { placeFullInclude } from "./prisma.presets";
import { Prisma } from "@prisma/client";

export async function countPlaces(where: Prisma.PlaceWhereInput) {
  return prisma.place.count({ where });
}

export async function upsertPlace(
  googlePlaceId: string,
  update: Prisma.PlaceUpdateInput,
  create: Prisma.PlaceCreateInput,
) {
  return prisma.place.upsert({
    where: { googlePlaceId },
    update,
    create,
  });
}

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

/**
 * Get places that need review
 */
export async function getPlacesNeedingReview() {
  return prisma.place.findMany({
    where: { needsReview: true },
    select: {
      id: true,
      slug: true,
      name: true,
      autoCreated: true,
      createdAt: true,
      city: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Search places by name or slug
 */
export async function searchPlaces(query: string, limit = 5) {
  return prisma.place.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { slug: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      city: { select: { name: true } },
      country: { select: { name: true } },
    },
    take: limit,
  });
}
