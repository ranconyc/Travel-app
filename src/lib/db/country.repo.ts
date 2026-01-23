import { Country } from "@/domain/country/country.schema";
import { prisma } from "@/lib/db/prisma";
import { countryFullInclude, countrySummarySelect } from "./prisma.presets";

// get all countries
export async function getAllCountries(): Promise<Country[]> {
  try {
    return (await prisma.country.findMany({
      orderBy: { name: "asc" },
    })) as unknown as Country[];
  } catch (error) {
    console.error("getAllCountries error:", error);
    throw new Error("Failed to fetch countries");
  }
}

//  get country with cities
export async function getCountryWithCities(cca3: string) {
  if (!cca3) return null;

  try {
    return await prisma.country.findUnique({
      where: { cca3: cca3.toUpperCase() },
      include: countryFullInclude,
    });
  } catch (error) {
    console.error("getCountryWithCities error:", error);
    throw new Error("Failed to fetch country");
  }
}

// find the border countries by cca3
export async function findBorderCountries(bordersCCA3: string[]) {
  if (!bordersCCA3?.length) return [];

  const countries = await prisma.country.findMany({
    where: {
      cca3: { in: bordersCCA3 },
    },
    select: countrySummarySelect,
  });

  return countries;
}

export async function getCountriesByCodes(codes: string[]) {
  if (!codes?.length) return [];

  try {
    return await prisma.country.findMany({
      where: {
        OR: [{ code: { in: codes } }, { cca3: { in: codes } }],
      },
    });
  } catch (error) {
    console.error("getCountriesByCodes error:", error);
    return [];
  }
}

export async function updateCountry(id: string, data: any) {
  try {
    return await prisma.country.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("updateCountry error:", error);
    throw new Error("Failed to update country");
  }
}

export async function deleteCountry(id: string) {
  try {
    return await prisma.country.delete({
      where: { id },
    });
  } catch (error) {
    console.error("deleteCountry error:", error);
    throw new Error("Failed to delete country");
  }
}

// get countries by region (Continent)
export async function getCountriesByRegion(region: string): Promise<Country[]> {
  try {
    return (await prisma.country.findMany({
      where: {
        region: {
          equals: region,
          mode: "insensitive",
        },
      },
      orderBy: { name: "asc" },
      select: countrySummarySelect,
    })) as unknown as Country[];
  } catch (error) {
    console.error("getCountriesByRegion error:", error);
    return [];
  }
}
