import { prisma } from "@/lib/db/prisma";

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
