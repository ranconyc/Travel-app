import { prisma } from "@/lib/db/prisma";
import { NearestCityResult } from "@/domain/city/city.schema";
import { Prisma } from "@prisma/client";

function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function makeCityId(cityName: string, countryCode2: string): string {
  const slug = slugify(cityName);
  return `${slug}-${countryCode2.toLowerCase()}`;
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
  km = 120,
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
          countryCode: 1,
          imageHeroUrl: 1,
          radiusKm: 1,
          distanceKm: { $divide: ["$dist_m", 1000] },
        },
      },
    ],
  });

  return (res as unknown as any[]).map(
    (row): NearestCityResult & { id: string } => ({
      id: row._id?.["$oid"] || row._id,
      cityId: row.cityId ?? null,
      name: row.name ?? null,
      countryCode: row.countryCode ?? null,
      imageHeroUrl: row.imageHeroUrl ?? null,
      radiusKm: typeof row.radiusKm === "number" ? row.radiusKm : null,
      distanceKm: typeof row.distanceKm === "number" ? row.distanceKm : null,
    }),
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
 * Finds a state using name or code within a country.
 */
export async function findState(
  countryRefId: string,
  name?: string,
  code?: string,
) {
  return prisma.state.findFirst({
    where: {
      countryRefId,
      OR: [
        { code: { equals: code || undefined, mode: "insensitive" } },
        { name: { equals: name || undefined, mode: "insensitive" } },
      ],
    },
  });
}

/**
 * Creates a new state record.
 */
export async function createState(data: {
  name: string;
  code: string | null;
  countryRefId: string;
}) {
  return prisma.state.create({ data });
}

/**
 * Upserts a city record based on its unique cityId.
 */
export async function upsertCity(
  cityId: string,
  data: Prisma.CityUpsertArgs["update"],
) {
  return prisma.city.upsert({
    where: { cityId },
    update: data,
    create: { ...data, cityId } as Prisma.CityUpsertArgs["create"],
  });
}
