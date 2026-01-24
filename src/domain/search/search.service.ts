import { prisma } from "@/lib/db/prisma";
import { saveSearchEvent } from "@/lib/db/search.repo";
import { SearchResult } from "./search.schema";

const LOCATIONIQ_KEY = process.env.LOCATIONIQ_API_KEY;

export async function handleSearchDestinations(
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
        { altSpellings: { hasSome: [normalizedQuery] } },
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

  return [...countryResults, ...cityResults];
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

    if (!countryCode) return null;

    let country = await prisma.country.findUnique({
      where: { cca3: countryCode },
    });

    if (!country) {
      country = await prisma.country.findFirst({
        where: { code: countryCode },
      });
    }

    if (!country) {
      country = await prisma.country.create({
        data: {
          name: countryName,
          cca3: countryCode.length === 3 ? countryCode : countryCode + "X",
          code: countryCode.substring(0, 2),
          region: "Unknown",
        },
      });
    }

    const cityName =
      externalItem.address?.city ||
      externalItem.address?.town ||
      externalItem.name ||
      externalItem.display_name?.split(",")[0];
    const generatedCityId = cityName.toLowerCase().replace(/[^a-z0-9]/g, "-");

    const lat = parseFloat(externalItem.lat);
    const lon = parseFloat(externalItem.lon);

    const existing = await prisma.city.findFirst({
      where: { cityId: generatedCityId },
    });

    if (existing) return existing.cityId;

    const newCity = await prisma.city.create({
      data: {
        cityId: generatedCityId + "-" + Math.floor(Math.random() * 1000),
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
