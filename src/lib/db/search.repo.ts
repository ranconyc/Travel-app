/**
 * Search repository - handles database queries for search functionality
 */

import { prisma } from "@/lib/db/prisma";
import { SearchResult, SearchEventData } from "@/types/search";

const MAX_RESULTS_PER_TYPE = 5;

/**
 * Search cities by name
 */
export async function searchCities(query: string): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const cities = await prisma.city.findMany({
    where: {
      name: { contains: trimmed, mode: "insensitive" },
    },
    include: {
      country: { select: { name: true, code: true } },
    },
    take: MAX_RESULTS_PER_TYPE,
  });

  return cities.map((city) => ({
    id: `city-${city.id}`,
    label: city.country ? `${city.name}, ${city.country.name}` : city.name,
    subtitle: city.country?.code,
    type: "city" as const,
    entityId: city.cityId, // Use cityId slug for routing
    meta: {
      countryName: city.country?.name,
      cityName: city.name,
    },
  }));
}

/**
 * Search countries by name
 */
export async function searchCountries(query: string): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const countries = await prisma.country.findMany({
    where: {
      OR: [
        { name: { contains: trimmed, mode: "insensitive" } },
        { code: { contains: trimmed, mode: "insensitive" } },
      ],
    },
    take: MAX_RESULTS_PER_TYPE,
  });

  return countries.map((country) => ({
    id: `country-${country.id}`,
    label: country.name,
    subtitle: country.code,
    type: "country" as const,
    entityId: country.cca3, // Use cca3 slug for routing
    meta: {
      countryName: country.name,
      region: (country as any).region,
    },
  }));
}

/**
 * Search activities by name
 */
export async function searchActivities(query: string): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const places = await prisma.place.findMany({
    where: {
      OR: [
        { name: { contains: trimmed, mode: "insensitive" } },
        { slug: { contains: trimmed, mode: "insensitive" } },
      ],
    },
    include: {
      city: { select: { name: true } },
      country: { select: { name: true } },
    },
    take: MAX_RESULTS_PER_TYPE,
  });

  return places.map((place) => ({
    id: `activity-${place.id}`,
    label: place.name,
    subtitle: place.city ? `in ${place.city.name}` : place.country?.name,
    type: "activity" as const,
    entityId: place.slug, // Use slug for routing
    meta: {
      activityType: place.type,
      cityName: place.city?.name,
      countryName: place.country?.name,
    },
  }));
}

/**
 * Save a search event for analytics
 */
export async function saveSearchEvent(
  data: SearchEventData,
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.searchEvent.create({
      data: {
        userId: data.userId || null,
        sessionId: data.sessionId,
        searchQuery: data.searchQuery,
        resultCount: data.resultCount,
        clickedResultIndex: data.clickedResultIndex ?? null,
        pagePath: data.pagePath || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to save search event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
