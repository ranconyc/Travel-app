"use server";

import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { revalidatePath } from "next/cache";

export type SearchResult = {
  id: string;
  name: string;
  type: "COUNTRY" | "CITY" | "EXTERNAL"; // Added EXTERNAL
  slug: string; // Internal slug or external ID
  image?: string | null;
  subText?: string;
  flag?: string | null;
  externalData?: any; // For saving later
};

const LOCATIONIQ_KEY = process.env.LOCATIONIQ_API_KEY;

export async function searchDestinations(
  query: string,
): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const normalizedQuery = query.toLowerCase();

  // 1. Search Countries
  const countries = await prisma.country.findMany({
    where: {
      OR: [
        { name: { contains: normalizedQuery, mode: "insensitive" } },
        { cca3: { contains: normalizedQuery, mode: "insensitive" } },
        { altSpellings: { hasSome: [normalizedQuery] } }, // Exact match on alt spelling usually, or manual filter
      ],
    },
    take: 5,
    select: {
      id: true,
      name: true,
      cca3: true,
      imageHeroUrl: true,
      flag: true,
      region: true,
    },
  });

  // 2. Search Cities
  const cities = await prisma.city.findMany({
    where: {
      name: { contains: normalizedQuery, mode: "insensitive" },
    },
    take: 5,
    include: {
      country: {
        select: {
          name: true,
          cca3: true,
          flag: true,
        },
      },
    },
  });

  // 3. Map to unified format
  const cityResults: SearchResult[] = cities.map((c) => ({
    id: c.id,
    name: c.name,
    type: "CITY",
    slug: c.cityId ?? c.name.toLowerCase().replace(/\s+/g, "-"),
    image: c.imageHeroUrl,
    subText: c.country?.name,
    flag: c.country?.flag,
  }));

  const countryResults: SearchResult[] = countries.map((c) => ({
    id: c.id,
    name: c.name,
    type: "COUNTRY",
    slug: c.cca3,
    image: c.imageHeroUrl,
    subText: c.region || "Country",
    flag: c.flag,
  }));

  // Interleave or prioritize? Countries usually top if exact match.
  // For now, just concat.
  return [...countryResults, ...cityResults];
}

/**
 * Fallback search using LocationIQ
 */
export async function searchExternalDestinations(
  query: string,
): Promise<SearchResult[]> {
  if (!query || query.length < 2 || !LOCATIONIQ_KEY) return [];

  const url = `https://api.locationiq.com/v1/search?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(
    query,
  )}&limit=5&format=json&accept-language=en`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
      id: `ext_${item.place_id}`,
      name: item.display_name?.split(",")[0] || item.name, // Simple name
      type: "EXTERNAL",
      slug: "", // No slug yet
      subText: item.display_name, // Full address as subtext
      externalData: item,
    }));
  } catch (error) {
    console.error("External search failed:", error);
    return [];
  }
}

/**
 * Save an externally found city to the DB
 */
export async function saveExternalDestination(
  externalItem: any,
): Promise<string | null> {
  if (!externalItem) return null;

  try {
    // 1. Identify Country
    const countryCode = externalItem.address?.country_code?.toUpperCase();
    const countryName = externalItem.address?.country || "Unknown";

    if (!countryCode) return null;

    let country = await prisma.country.findUnique({
      where: { cca3: countryCode }, // Check by CCA3/Code. LocationIQ gives 2-letter usually?
    });

    if (!country) {
      // Try finding by code (2 letter)
      country = await prisma.country.findFirst({
        where: { code: countryCode },
      });
    }

    // If still no country, we might need to create it (simplified for now)
    // For this task, assuming country mostly exists or we skip.
    // Ideally we fetch from RestCountries here if missing.
    if (!country) {
      // Just fail for now to rely on existing countries, or create basic
      // Creating basic country to allow city creation
      country = await prisma.country.create({
        data: {
          name: countryName,
          cca3: countryCode.length === 3 ? countryCode : countryCode + "X", // Hack if only 2 letter
          code: countryCode.substring(0, 2),
          region: "Unknown",
        },
      });
    }

    // 2. Create City
    const cityName =
      externalItem.address?.city ||
      externalItem.address?.town ||
      externalItem.name ||
      externalItem.display_name?.split(",")[0];
    const generatedCityId = cityName.toLowerCase().replace(/[^a-z0-9]/g, "-");

    const lat = parseFloat(externalItem.lat);
    const lon = parseFloat(externalItem.lon);

    // Check if city exists
    const existing = await prisma.city.findFirst({
      where: { cityId: generatedCityId },
    });

    if (existing) return existing.cityId;

    const newCity = await prisma.city.create({
      data: {
        cityId: generatedCityId + "-" + Math.floor(Math.random() * 1000), // Ensure uniqueness
        name: cityName,
        countryRefId: country!.id,
        coords: { type: "Point", coordinates: [lon, lat] },
        autoCreated: true,
      },
    });

    return newCity.cityId;
  } catch (err) {
    console.error("Failed to save external destination:", err);
    return null;
  }
}

export async function trackSearch(
  query: string,
  resultCount: number,
  clickedResultIndex?: number,
  path?: string,
) {
  try {
    const user = await getCurrentUser();

    // In a real app, you might get sessionId from cookies or headers
    const sessionId = "session-" + (user?.id || Date.now().toString());

    await prisma.searchEvent.create({
      data: {
        userId: user?.id,
        sessionId: sessionId,
        searchQuery: query,
        resultCount: resultCount,
        clickedResultIndex: clickedResultIndex,
        pagePath: path || "/",
      },
    });
  } catch (error) {
    console.error("Failed to track search event:", error);
    // Don't modify UI flow for tracking error
  }
}
