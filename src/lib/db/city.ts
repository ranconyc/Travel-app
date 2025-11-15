// lib/location/cityLocation.ts
import { prisma } from "@/lib/db/prisma";
import { env } from "process";

/**
 * Result for nearby / nearest city lookups based on the City collection.
 */
export type NearestCityResult = {
  cityId: string | null;
  name: string | null;
  countryCode: string | null;
  imageHeroUrl?: string | null;
  radiusKm?: number | null;
  distanceKm: number | null; // distance from query point in kilometers
};

/**
 * Result from external reverse geocoding (LocationIQ).
 */
export type ReverseGeocodeResult = {
  city: string | null;
  countryCode: string | null;
  label: string | null; // e.g. "Bangkok, TH"
};

/**
 * Unified detected city result, combining DB + external sources.
 */
export type DetectedCity = {
  cityId: string | null; // internal cityId from DB (if matched)
  cityName: string | null;
  countryCode: string | null;
  label: string | null; // "Bangkok, TH" or similar
  source: "db" | "locationiq" | "unknown";
  distanceKm: number | null; // distance to DB city (if used)
  radiusKm: number | null; // city radius from schema (if used)
};

export async function getAllCities() {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { name: "asc" },
    });

    return cities;
  } catch (err) {
    console.error("❌ getAllCities error:", err);
    return [];
  }
}

//  Get cities within X km of a point, sorted by distance (nearest first).
export async function findNearbyCities(
  lng: number,
  lat: number,
  km = 120,
  limit = 10
): Promise<NearestCityResult[]> {
  const meters = km * 1000;

  const res = await prisma.city.aggregateRaw({
    pipeline: [
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] }, // GeoJSON: [lng, lat]
          distanceField: "dist_m", // distance in meters
          spherical: true,
          maxDistance: meters,
        },
      },
      { $limit: limit },
      {
        $project: {
          cityId: 1,
          name: 1,
          countryCode: 1, // make sure this exists on your City model
          imageHeroUrl: 1,
          radiusKm: 1,
          distanceKm: { $divide: ["$dist_m", 1000] }, // meters -> km
        },
      },
    ],
  });

  // Normalize raw Json[] into typed result with null safety
  return (res as any[]).map(
    (row): NearestCityResult => ({
      cityId: row.cityId ?? null,
      name: row.name ?? null,
      countryCode: row.countryCode ?? null,
      imageHeroUrl: row.imageHeroUrl ?? null,
      radiusKm: typeof row.radiusKm === "number" ? row.radiusKm : null,
      distanceKm: typeof row.distanceKm === "number" ? row.distanceKm : null,
    })
  );
}

// Get the single nearest city within a radius.
export async function findNearestCity(
  lng: number,
  lat: number,
  km = 300
): Promise<NearestCityResult | null> {
  const [nearest] = await findNearbyCities(lng, lat, km, 1);
  return nearest ?? null;
}

// 3) Reverse geocode using LocationIQ (external API).
export async function reverseGeocodeLocationIQ(
  lat: number,
  lng: number
): Promise<ReverseGeocodeResult> {
  try {
    const key = process.env.LOCATIONIQ_API_KEY;
    if (!key) {
      throw new Error("Missing LOCATIONIQ_API_KEY env var");
    }

    const url = `https://us1.locationiq.com/v1/reverse?key=${env.LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lng}&format=json`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`LocationIQ reverse failed: ${res.status}`);
    }

    const data = await res.json();
    const address = data.address ?? {};

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.suburb ||
      address.municipality ||
      null;

    const countryCode = address.country_code
      ? String(address.country_code).toUpperCase()
      : null;

    return {
      city,
      countryCode,
      label: city && countryCode ? `${city}, ${countryCode}` : city ?? null,
    };
  } catch (err) {
    console.error("reverseGeocodeLocationIQ error:", err);
    return { city: null, countryCode: null, label: null };
  }
}

/**
 * 4) Main logic: detect city from coordinates.
 *
 * Strategy:
 *  1. Use DB (nearest city via $geoNear) and city.radiusKm to decide
 *     if the user is "inside" a known city.
 *  2. If no good DB match -> fallback to LocationIQ reverse geocoding.
 *
 * NOTE:
 *  - Function signature is (lat, lng) – easier for callers.
 *  - Internally, DB calls still use (lng, lat) for GeoJSON.
 */
export async function detectCityFromCoords(
  lat: number,
  lng: number,
  options?: {
    searchRadiusKm?: number; // how far to search in DB for nearest city
  }
): Promise<DetectedCity> {
  const searchRadiusKm = options?.searchRadiusKm ?? 500;

  // 1) Try to resolve via internal City DB
  const nearest = await findNearestCity(lng, lat, searchRadiusKm);

  if (
    nearest &&
    nearest.distanceKm != null &&
    nearest.radiusKm != null &&
    nearest.distanceKm <= nearest.radiusKm
  ) {
    const label =
      nearest.name && nearest.countryCode
        ? `${nearest.name}, ${nearest.countryCode}`
        : nearest.name ?? null;

    return {
      cityId: nearest.cityId,
      cityName: nearest.name,
      countryCode: nearest.countryCode,
      label,
      source: "db",
      distanceKm: nearest.distanceKm,
      radiusKm: nearest.radiusKm,
    };
  }

  // 2) Fallback to LocationIQ
  const external = await reverseGeocodeLocationIQ(lat, lng);

  return {
    cityId: null,
    cityName: external.city,
    countryCode: external.countryCode,
    label: external.label,
    source: external.label ? "locationiq" : "unknown",
    distanceKm: null,
    radiusKm: null,
  };
}
