import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const MAX_RESULTS = 10;
const LOCATIONIQ_BASE_URL = "https://api.locationiq.com/v1/search";

type LocationIqItem = {
  place_id?: number | string;
  lat?: string;
  lon?: string;
  osm_id?: number | string;
  osm_type?: string;
  boundingbox?: string[] | number[];
  class?: string;
  type?: string;
  display_place?: string;
  name?: string;
  display_name?: string; // Added this, often present in LocationIQ
  display_address?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
    country_code?: string;
  };
};

type NormalizedCity = {
  id: string;
  cityId: string;
  label: string;
  subtitle: string | null;
  lat: number | null;
  lng: number | null;
  boundingbox?: string[] | number[];
  source: "db" | "external";
  dbCityId?: string;
  autoCreated?: boolean;
  needsReview?: boolean;
  meta?: {
    name: string;
    countryName: string;
    countryCode: string;
    lat: number;
    lng: number;
    placeId?: string;
    osmId?: string;
    osmType?: string;
    display_place?: string;
    display_name?: string;
    address?: any;
    boundingbox?: any;
  } | null;
};

function isDev() {
  return process.env.NODE_ENV !== "production";
}

function logDev(...args: any[]) {
  if (isDev()) {
    console.log("[/api/cities/search]", ...args);
  }
}

/**
 * Build LocationIQ URL with proper query params.
 */
function buildLocationIqUrl(q: string, apiKey: string): string {
  const url = new URL(LOCATIONIQ_BASE_URL);

  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", q);
  url.searchParams.set("limit", String(MAX_RESULTS));
  url.searchParams.set("accept-language", "en"); // force English results
  url.searchParams.set("format", "json"); // Ensure JSON format

  return url.toString();
}

/**
 * Normalize cities from our DB into the common shape.
 */
async function findLocalCities(q: string): Promise<NormalizedCity[]> {
  const localCities = await prisma.city.findMany({
    where: {
      name: { contains: q, mode: "insensitive" },
    },
    include: {
      country: { select: { id: true, name: true, code: true } },
    },
    take: MAX_RESULTS,
  });

  logDev("localCities count:", localCities.length);

  return localCities.map(
    (c): NormalizedCity => ({
      id: c.id, // real City.id from DB
      cityId: c.cityId,
      label: c.country ? `${c.name}, ${c.country.name}` : c.name,
      subtitle: c.country?.code ?? null,
      lat: (c.coords as any)?.coordinates?.[1] ?? null,
      lng: (c.coords as any)?.coordinates?.[0] ?? null,
      autoCreated: c.autoCreated,
      needsReview: c.needsReview,
      source: "db",
      dbCityId: c.id,
      meta: null, // not needed for DB cities
    })
  );
}

/**
 * Normalize a single item from LocationIQ into the common shape.
 */
function normalizeLocationIqItem(item: LocationIqItem): NormalizedCity | null {
  const lat = item.lat ? parseFloat(item.lat) : null;
  const lng = item.lon ? parseFloat(item.lon) : null;
  const countryName = item.address?.country || "Unknown Country";
  const countryCode = item.address?.country_code || null;
  const cityName =
    item.address?.city ||
    item.address?.town ||
    item.address?.village ||
    item.name ||
    item.display_name ||
    "Unnamed Place";

  // Basic validation that we have coordinates and a name
  if (lat === null || lng === null || !item.place_id) {
    return null;
  }

  return {
    id: `ext_${item.place_id}`, // Unique ID for external source
    cityId: `ext_${item.place_id}`,
    label: `${cityName}, ${countryName}`,
    subtitle: countryCode ? countryCode.toUpperCase() : null,
    lat: lat,
    lng: lng,
    boundingbox: item.boundingbox,
    source: "external",
    dbCityId: undefined,
    autoCreated: false,
    needsReview: true, // Mark external items for review
    meta: {
      name: cityName,
      countryName: countryName,
      countryCode: countryCode || "",
      lat: lat,
      lng: lng,
      placeId: String(item.place_id),
      osmId: String(item.osm_id),
      osmType: item.osm_type,
      display_place: item.display_place || "",
      display_name: item.display_name || "",
      address: item.address,
      boundingbox: item.boundingbox,
    },
  };
}

/**
 * Fetch and normalize cities from LocationIQ (external source).
 */
async function findExternalCities(q: string): Promise<NormalizedCity[]> {
  const apiKey = process.env.LOCATIONIQ_API_KEY;
  if (!apiKey) {
    console.error("Missing LOCATIONIQ_API_KEY env variable");
    return [];
  }

  const url = buildLocationIqUrl(q, apiKey);

  const externalRes = await fetch(url, {
    cache: "no-store",
  });

  // 1. Check for request failure
  if (!externalRes.ok) {
    const errorText = await externalRes.text().catch(() => "No response body");
    console.error("LocationIQ request failed", externalRes.status, errorText);
    return [];
  }

  // 2. Consume the stream once and store the data
  let externalData: LocationIqItem[];
  try {
    externalData = (await externalRes.json()) as LocationIqItem[];
  } catch (e) {
    console.error("Failed to parse JSON from LocationIQ response:", e);
    return [];
  }

  if (isDev()) {
    logDev("raw external items (count)", externalData.length);
  }

  // 3. Normalize the data
  return externalData
    .map(normalizeLocationIqItem)
    .filter((item): item is NormalizedCity => item !== null)
    .slice(0, MAX_RESULTS); // Ensure we don't exceed max results after normalization
}

/**
 * GET /api/cities/search?q=...
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();

    if (!q || q.length < 2) {
      return NextResponse.json<NormalizedCity[]>([]);
    }

    // 1) Try DB first (Currently commented out)
    // const local = await findLocalCities(q);
    // if (local.length > 0) {
    //   return NextResponse.json(local);
    // }

    if (process.env.NODE_ENV !== "production") {
      console.log("LocationIQ API query:", q);
    }

    // 2) Fallback to LocationIQ
    const external = await findExternalCities(q);
    return NextResponse.json(external);
  } catch (err) {
    console.error("GET /api/cities/search error", err);
    return NextResponse.json<NormalizedCity[]>([]);
  }
}
