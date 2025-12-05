import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const MAX_RESULTS = 10;
const LOCATIONIQ_BASE_URL = "https://api.locationiq.com/v1/autocomplete";

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
  url.searchParams.set("normalizeaddress", "1");
  url.searchParams.set("dedupe", "1");
  url.searchParams.set("accept-language", "en"); // force English results

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

  if (!externalRes.ok) {
    console.error(
      "LocationIQ request failed",
      externalRes.status,
      await externalRes.text().catch(() => "")
    );
    return [];
  }

  const externalData = (await externalRes.json()) as LocationIqItem[];

  if (isDev()) {
    logDev(
      "raw external items (filtered to place/city-like)",
      externalData.filter(
        (item) => item.class === "place" || item.type === "city"
      )
    );
  }

  const cityCandidates = externalData
    .filter((item) => item.class === "place" || item.type === "city")
    .map((item) => {
      const lat = item.lat ? parseFloat(item.lat) : NaN;
      const lng = item.lon ? parseFloat(item.lon) : NaN;

      const cityName =
        item.address?.city ||
        item.address?.town ||
        item.address?.village ||
        item.display_place ||
        item.name;

      const countryName =
        item.address?.country ||
        item.display_address?.split(",").slice(-1)[0]?.trim() ||
        "";

      const countryCode = (item.address?.country_code || "").toUpperCase();

      return {
        tempId:
          item.place_id?.toString() ?? `${cityName || "city"}-${countryCode}`,
        cityName,
        countryName,
        countryCode,
        boundingbox: item.boundingbox,
        lat,
        lng,
        originalItem: item, // Preserve the original API data
      };
    })
    .filter(
      (c) =>
        c.cityName &&
        c.countryName &&
        !Number.isNaN(c.lat) &&
        !Number.isNaN(c.lng)
    );

  if (cityCandidates.length === 0) return [];

  return cityCandidates.map(
    (c): NormalizedCity => ({
      id: c.tempId, // for React key, not DB id
      cityId: `${c
        .cityName!.toLowerCase()
        .trim()
        .replace(/\s+/g, "-")}-${c.countryCode.toLowerCase()}`,
      label: `${c.cityName}, ${c.countryName}`,
      subtitle: c.countryCode || null,
      lat: c.lat,
      lng: c.lng,
      boundingbox: c.boundingbox,
      source: "external",
      dbCityId: undefined,
      autoCreated: undefined,
      needsReview: undefined,
      meta: {
        name: c.cityName!,
        countryName: c.countryName,
        countryCode: c.countryCode,
        lat: c.lat,
        lng: c.lng,
        placeId: c.originalItem.place_id?.toString(),
        osmId: c.originalItem.osm_id?.toString(),
        osmType: c.originalItem.osm_type,
        display_place: c.originalItem.display_place,
        display_name: c.originalItem.name,
        address: c.originalItem.address,
        boundingbox: c.originalItem.boundingbox,
      },
    })
  );
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

    // 1) Try DB first
    const local = await findLocalCities(q);
    if (local.length > 0) {
      return NextResponse.json(local);
    }

    // 2) Fallback to LocationIQ
    const external = await findExternalCities(q);
    return NextResponse.json(external);
  } catch (err) {
    console.error("GET /api/cities/search error", err);
    return NextResponse.json<NormalizedCity[]>([]);
  }
}
