import { prisma } from "@/lib/db/prisma";
import { FavoriteType } from "@prisma/client";

export async function findFavorite(
  userId: string,
  type: FavoriteType,
  entityId: string,
) {
  return prisma.favorite.findUnique({
    where: {
      userId_type_entityId: { userId, type, entityId },
    },
  });
}

export async function deleteFavorite(id: string) {
  return prisma.favorite.delete({
    where: { id },
  });
}

export async function createFavorite(
  userId: string,
  type: FavoriteType,
  entityId: string,
) {
  return prisma.favorite.create({
    data: { userId, type, entityId },
  });
}

export async function getFavorites(userId: string, type?: FavoriteType) {
  return prisma.favorite.findMany({
    where: {
      userId,
      ...(type && { type }),
    },
    orderBy: { createdAt: "desc" },
  });
}

export type FavoriteWithDetails = {
  id: string;
  type: FavoriteType;
  entityId: string;
  name: string;
  imageHeroUrl: string | null;
  subtitle: string | null;
  slug: string;
  createdAt: Date;
  parentId?: string | null;
  parentName?: string | null;
  countryCode?: string | null;
};

/**
 * Fetch favorites with entity details (name, image, subtitle).
 * Uses separate queries per type for flexibility.
 */
export async function getFavoritesWithDetails(
  userId: string,
  type?: FavoriteType,
): Promise<FavoriteWithDetails[]> {
  const favorites = await getFavorites(userId, type);

  if (favorites.length === 0) return [];

  // Group favorites by type
  const countryIds = favorites
    .filter((f) => f.type === "COUNTRY")
    .map((f) => f.entityId);
  const cityIds = favorites
    .filter((f) => f.type === "CITY")
    .map((f) => f.entityId);
  const placeIds = favorites
    .filter((f) => f.type === "PLACE")
    .map((f) => f.entityId);

  // Fetch entities in parallel
  const [countries, cities, places] = await Promise.all([
    countryIds.length > 0
      ? prisma.country.findMany({
          where: { id: { in: countryIds } },
          select: { id: true, name: true, imageHeroUrl: true, code: true },
        })
      : [],
    cityIds.length > 0
      ? prisma.city.findMany({
          where: { id: { in: cityIds } },
          select: {
            id: true,
            name: true,
            imageHeroUrl: true,
            slug: true,
            country: { select: { id: true, name: true, code: true } },
          },
        })
      : [],
    placeIds.length > 0
      ? prisma.place.findMany({
          where: { id: { in: placeIds } },
          select: {
            id: true,
            name: true,
            imageHeroUrl: true,
            slug: true,
            city: {
              select: {
                id: true,
                name: true,
                country: { select: { code: true } },
              },
            },
          },
        })
      : [],
  ]);

  // Create lookup maps
  const countryMap = new Map(countries.map((c) => [c.id, c]));
  const cityMap = new Map(cities.map((c) => [c.id, c]));
  const placeMap = new Map(places.map((p) => [p.id, p]));

  // Enrich favorites with entity details
  return favorites.map((fav) => {
    if (fav.type === "COUNTRY") {
      const country = countryMap.get(fav.entityId);
      return {
        id: fav.id,
        type: fav.type,
        entityId: fav.entityId,
        name: country?.name ?? "Unknown",
        imageHeroUrl: country?.imageHeroUrl ?? null,
        subtitle: null,
        slug: country?.code ?? "",
        createdAt: fav.createdAt,
        countryCode: country?.code ?? null,
      };
    } else if (fav.type === "CITY") {
      const city = cityMap.get(fav.entityId);
      return {
        id: fav.id,
        type: fav.type,
        entityId: fav.entityId,
        name: city?.name ?? "Unknown",
        imageHeroUrl: city?.imageHeroUrl ?? null,
        subtitle: city?.country?.name ?? null,
        slug: city?.slug ?? "",
        createdAt: fav.createdAt,
        parentId: city?.country?.id ?? null,
        parentName: city?.country?.name ?? null,
        countryCode: city?.country?.code ?? null,
      };
    } else {
      const place = placeMap.get(fav.entityId);
      return {
        id: fav.id,
        type: fav.type,
        entityId: fav.entityId,
        name: place?.name ?? "Unknown",
        imageHeroUrl: place?.imageHeroUrl ?? null,
        subtitle: place?.city?.name ?? null,
        slug: place?.slug ?? "",
        createdAt: fav.createdAt,
        parentId: place?.city?.id ?? null,
        parentName: place?.city?.name ?? null,
        countryCode: place?.city?.country?.code ?? null,
      };
    }
  });
}
