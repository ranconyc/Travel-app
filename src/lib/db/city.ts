import { prisma } from "@/lib/db/prisma";
import { City } from "@prisma/client";

export async function getCitiesWithCountry(cityId: string) {
  console.log("getCountryWithCities", cityId);
  if (!cityId) return null;
  try {
    return prisma.city?.findUnique({
      where: { cityId: cityId },
      select: {
        id: true,
        cityId: true,
        name: true,
        imageHeroUrl: true,
        bestSeason: true,
        idealDuration: true,
        safety: true,
        neighborhoods: true,
        budget: true,
        gettingAround: true,
        country: {
          select: {
            id: true,
            name: true,
            emergency: true,
            currency: true,
            languageComm: true,
            countryId: true,
          },
        },
      },
    });
  } catch (error) {
    console.log("getCountryWithCities error", error);
    return null;
  }
}

// get cities within X km sorted by distance
export async function findNearbyCities(
  lng: number,
  lat: number,
  km = 120,
  limit = 10
) {
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
          cityId: 1,
          name: 1,
          imageHeroUrl: 1,
          radiusKm: 1,
          dist_km: { $divide: ["$dist_m", 1000] },
        },
      },
    ],
  });
  return res as Array<City>;
}

export async function getAllCities() {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { name: "asc" }, // Sort alphabetically
      select: {
        id: true,
        cityId: true,
        name: true,
        imageHeroUrl: true,
        images: true,
        bestSeason: true,
        idealDuration: true,
        safety: true,
        neighborhoods: true,
        coords: true,
        radiusKm: true,
        budget: true,
        gettingAround: true,
        country: {
          select: { id: true, name: true, code: true },
        },
      },
    });

    return cities;
  } catch (error) {
    console.error("❌ getAllCities error:", error);
    return [];
  }
}
