import { saveSearchEvent } from "@/lib/db/search.repo";
import { SearchResult } from "./search.schema";
import { getCountryFlagEmoji } from "@/utils/data-helpers";

const LOCATIONIQ_KEY = process.env.LOCATIONIQ_API_KEY;

export async function handleSearchDestinations(
  query: string,
): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const normalizedQuery = query.toLowerCase();

  // 1. Search Countries
  const { searchCountriesByNameOrCode } = await import("@/lib/db/country.repo");
  // We need to implement a more robust search in repo or use this simple one
  const countries = await searchCountriesByNameOrCode(query, 5);

  // 2. Search Cities
  const { searchCities } = await import("@/lib/db/cityLocation.repo");
  const cities = await searchCities(normalizedQuery, 5);

  // 3. Map to unified format
  const cityResults: SearchResult[] = cities.map((c) => ({
    id: c.id,
    name: c.name,
    type: "CITY",
    slug: c.cityId ?? c.name.toLowerCase().replace(/\s+/g, "-"),
    image: c.imageHeroUrl,
    subText: c.country?.name,
    flag: c.country?.code ? getCountryFlagEmoji(c.country.code) : undefined,
  }));

  const countryResults: SearchResult[] = countries.map((c) => ({
    id: c.id,
    name: c.name,
    type: "COUNTRY",
    slug: c.cca3,
    image: c.imageHeroUrl,
    subText: c.region || "Country",
    flag: c.code ? getCountryFlagEmoji(c.code) : undefined,
  }));

  return [...countryResults, ...cityResults]; // Return combined results
}

interface LocationIQResult {
  place_id: string;
  display_name: string;
  name?: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    country?: string;
    country_code?: string;
  };
}

export async function handleSearchExternalDestinations(
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

    return (data as LocationIQResult[]).map((item) => ({
      id: `ext_${item.place_id}`,
      name: item.display_name?.split(",")[0] || item.name || "",
      type: "EXTERNAL",
      slug: "",
      subText: item.display_name,
      flag: getCountryFlagEmoji(item.address?.country_code),
      externalData: item,
    }));
  } catch (error) {
    console.error("External search failed:", error);
    return [];
  }
}

export async function handleSaveExternalDestination(
  externalItemUnknown: unknown,
): Promise<string | null> {
  const externalItem = externalItemUnknown as LocationIQResult;
  if (!externalItem) return null;

  try {
    const countryCode = externalItem.address?.country_code?.toUpperCase();
    const countryName = externalItem.address?.country || "Unknown";
    const cityName =
      externalItem.address?.city ||
      externalItem.address?.town ||
      externalItem.name ||
      externalItem.display_name?.split(",")[0];
    const lat = parseFloat(externalItem.lat);
    const lon = parseFloat(externalItem.lon);

    if (!countryCode || !cityName) return null;

    // Use City Service to ensure consistent creation logic
    const { createCityFromAPI } = await import("@/domain/city/city.service");
    const city = await createCityFromAPI(
      cityName,
      countryCode,
      lat,
      lon,
      undefined, // bbox not available from this partial logic
    );

    return city.cityId;
  } catch (err) {
    console.error("Failed to save external destination:", err);
    return null;
  }
}

export async function handleTrackSearchEvent(data: {
  userId?: string;
  sessionId: string;
  searchQuery: string;
  resultCount?: number;
  clickedResultIndex?: number;
  clickedEntityType?: "city" | "country" | "activity";
  pagePath?: string;
}) {
  const sanitizedData = {
    ...data,
    sessionId: data.sessionId.substring(0, 100),
    searchQuery: data.searchQuery.substring(0, 200),
    resultCount: Math.max(0, data.resultCount || 0),
    clickedResultIndex:
      data.clickedResultIndex !== undefined
        ? Math.max(0, data.clickedResultIndex)
        : undefined,
    pagePath: data.pagePath?.substring(0, 200),
  };

  return await saveSearchEvent(sanitizedData);
}
