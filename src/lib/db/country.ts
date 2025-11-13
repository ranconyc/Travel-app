import { Country } from "@/domain/country/country.schema";
import { prisma } from "@/lib/db/prisma";

export async function getAllCountries() {
  try {
    return prisma.country.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.log("getAllCountries error", error);
    return [];
  }
}

export async function getCountryWithCities(countryId: string) {
  console.log("getCountryWithCities", countryId);
  if (!countryId) return null;
  try {
    return prisma.country.findUnique({
      where: { countryId },
      include: {
        cities: {
          orderBy: [{ name: "asc" }],
          select: {
            id: true,
            cityId: true,
            name: true,
            imageHeroUrl: true,
          },
        },
      },
    });
  } catch (error) {
    console.log("getCountryWithCities error", error);
    return null;
  }
}

export async function findNearbyCountries(
  lng: number,
  lat: number,
  km = 500,
  limit = 10
) {
  const meters = km * 1000;
  const results = await prisma.country.aggregateRaw({
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
          id: 1,
          countryId: 1,
          name: 1,
          code: 1,
          imageHeroUrl: 1,
          dist_km: { $divide: ["$dist_m", 1000] },
        },
      },
    ],
  });
  return results as Country[];
}
