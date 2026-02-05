import { prisma } from "@/lib/db/prisma";
import { NearestCityResult } from "@/domain/city/city.schema";
import { Prisma } from "@prisma/client";

import { slugify } from "@/lib/utils/slugify";

/**
 * Generate a unique city ID in format: city-state-country
 * Examples:
 *   - "san-francisco-ca-us" (US city with state)
 *   - "paris-fr" (non-US city without state)
 *   - "london-england-gb" (UK city with state/region)
 */
export function makeCityId(
  cityName: string,
  countryCode2: string,
  stateCode?: string,
): string {
  const citySlug = slugify(cityName);
  const countrySlug = countryCode2.toLowerCase();

  if (stateCode) {
    const stateSlug = slugify(stateCode);
    return `${citySlug}-${stateSlug}-${countrySlug}`;
  }

  return `${citySlug}-${countrySlug}`;
}

/**
 * Generate a SEO-friendly slug for URLs (same as cityId but can be extended)
 */
export function makeCitySlug(
  cityName: string,
  countryCode2: string,
  stateCode?: string,
): string {
  return makeCityId(cityName, countryCode2, stateCode);
}

// get city by id
export async function getCityById(cityId: string) {
  try {
    return await prisma.city.findUnique({
      where: { cityId },
    });
  } catch (error) {
    console.error("getCityById error:", error);
    throw new Error("Failed to fetch city");
  }
}

// get all the CITIES in the DB with pagination
export async function getAllCities(limit?: number, offset?: number) {
  try {
    return await prisma.city.findMany({
      orderBy: { name: "asc" },
      include: { country: true },
      take: limit,
      skip: offset,
    });
  } catch (err) {
    console.error("getAllCities error:", err);
    throw new Error("Failed to fetch cities");
  }
}

// find the nearest CITIES to a given point
export async function findNearbyCities(
  lng: number,
  lat: number,
  km = 500, // Increased default for better global coverage
  limit = 10,
): Promise<NearestCityResult[]> {
  const meters = km * 1000;

  const res = await prisma.city.aggregateRaw({
    pipeline: [
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "dist_m",
          spherical: true,
          maxDistance: meters,
        },
      },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          cityId: 1,
          name: 1,
          imageHeroUrl: 1,
          radiusKm: 1,
          wikiDataId: 1,
          distanceKm: { $divide: ["$dist_m", 1000] },
        },
      },
    ],
  });

  const nearbyCities = (res as unknown as any[]) || [];
  if (nearbyCities.length === 0) return [];

  // Fetch full city details including country
  const cityIds = nearbyCities
    .map((city) => city._id?.["$oid"] || city._id)
    .filter(Boolean);

  const citiesWithCountry = await prisma.city.findMany({
    where: { id: { in: cityIds } },
    include: { country: true },
  });

  // Merge the data
  return nearbyCities.map(
    (row): NearestCityResult & { id: string; country?: any } => {
      const dbId = row._id?.["$oid"] || row._id;
      const fullCity = citiesWithCountry.find((c) => c.id === dbId);

      return {
        id: dbId,
        cityId: row.cityId || fullCity?.cityId || null,
        name: row.name || fullCity?.name || "Unknown City",
        countryCode: fullCity?.country?.code || fullCity?.country?.cca3 || null,
        imageHeroUrl: row.imageHeroUrl || fullCity?.imageHeroUrl || null,
        radiusKm: typeof row.radiusKm === "number" ? row.radiusKm : null,
        distanceKm: typeof row.distanceKm === "number" ? row.distanceKm : null,
        wikiDataId: row.wikiDataId || fullCity?.wikiDataId || null,
        country: fullCity?.country || null,
      };
    },
  );
}

// find the nearest CITY to a given point
export async function findNearestCity(
  lng: number,
  lat: number,
  km = 300,
): Promise<NearestCityResult | null> {
  const [nearest] = await findNearbyCities(lng, lat, km, 1);
  return nearest ?? null;
}

// find city by bounding box
export async function findCityByBBox(
  lat: number,
  lng: number,
): Promise<NearestCityResult | null> {
  try {
    const res = await prisma.city.findRaw({
      filter: {
        "boundingBox.south": { $lte: lat },
        "boundingBox.north": { $gte: lat },
        "boundingBox.west": { $lte: lng },
        "boundingBox.east": { $gte: lng },
      },
    });

    const results = res as unknown as any[];
    if (!results || results.length === 0) return null;

    const city = results[0];

    return {
      id: city._id?.["$oid"] || city._id,
      cityId: city.cityId || null,
      name: city.name || null,
      countryCode: null,
      imageHeroUrl: city.imageHeroUrl || null,
      radiusKm: city.radiusKm || null,
      distanceKm: 0,
      wikiDataId: city.wikiDataId || null,
    };
  } catch (error) {
    console.error("findCityByBBox error:", error);
    return null;
  }
}

export async function getCitiesWithCountry(slug: string) {
  try {
    const city = await prisma.city.findUnique({
      where: { cityId: slug },
      include: {
        country: true,
      },
    });

    if (!city) {
      throw new Error(`City not found: ${slug}`);
    }

    return city;
  } catch (err) {
    console.error("getCitiesWithCountry error:", err);
    throw new Error("Failed to fetch city");
  }
}

export async function isCityExists(cityId: string) {
  const city = await prisma.city.findUnique({ where: { cityId } });
  return !!city;
}

export async function updateCity(id: string, data: Prisma.CityUpdateInput) {
  try {
    return await prisma.city.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("updateCity error:", error);
    throw new Error("Failed to update city");
  }
}

export async function deleteCity(id: string) {
  try {
    return await prisma.city.delete({
      where: { id },
    });
  } catch (error) {
    console.error("deleteCity error:", error);
    throw new Error("Failed to delete city");
  }
}

/**
 * Finds a city by its name and country code (cca2).
 */
export async function findCityByCapitalName(name: string, countryCode: string) {
  return prisma.city.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      country: { code: countryCode.toUpperCase() },
    },
  });
}

/**
 * Upserts a city record based on its unique cityId.
 * Note: slug is required for create - we use cityId as slug since it's already in slug format
 */
export async function upsertCity(
  cityId: string,
  data: Prisma.CityUpsertArgs["update"],
) {
  return prisma.city.upsert({
    where: { cityId },
    update: data,
    create: {
      ...data,
      cityId,
      slug: (data as any).slug || cityId,
    } as Prisma.CityUpsertArgs["create"],
  });
}

// Search for cities by name
export async function searchCities(query: string, limit = 10) {
  try {
    return await prisma.city.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
      },
      include: { country: true, state: true },
      take: limit,
    });
  } catch (error) {
    console.error("searchCities error:", error);
    return [];
  }
}

/**
 * Get city by UUID with Country included
 */
export async function getCityByIdWithCountry(id: string) {
  return prisma.city.findUnique({
    where: { id },
    include: { country: true },
  });
}

/**
 * Count total cities
 */
export async function countCities() {
  return prisma.city.count();
}

/**
 * Get cities that need review
 */
export async function getCitiesNeedingReview() {
  return prisma.city.findMany({
    where: { needsReview: true },
    select: {
      id: true,
      cityId: true,
      name: true,
      autoCreated: true,
      country: {
        select: {
          name: true,
          code: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });
}
