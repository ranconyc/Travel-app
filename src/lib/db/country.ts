import { prisma } from "@/lib/db/prisma";

/**
 * Get a country with its cities.
 *
 * @param {string} countryId
 *
 * @returns {Promise<object>}
 */

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
