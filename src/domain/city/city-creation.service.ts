import type { HomeBaseLocationMeta } from "@/domain/user/completeProfile.schema";
import { makeCityId, upsertCity } from "@/lib/db/cityLocation.repo";
import { findCountryByCode } from "@/lib/db/country.repo";
import { findState, createState } from "@/lib/db/state.repo";
import { estimateRadiusKmFromBBox } from "@/lib/utils/geo.utils";
import { JsonCityService } from "@/domain/city/city-data.service";
import { geocodeCityFull } from "@/domain/city/city-geocoding.service";
import { buildCityMeta } from "@/domain/city/city.utils";

/**
 * Creates a city from a name and coordinates
 */
export async function createCityFromAPI(
  cityName: string,
  countryCode: string,
  lat: number,
  lng: number,
  boundingbox?: [number, number, number, number],
  state?: string | null,
  stateCode?: string | null,
  stateType?: string | null,
) {
  const meta = buildCityMeta({
    name: cityName,
    countryCode,
    lat,
    lng,
    boundingBox: boundingbox,
    state,
    stateCode,
    stateType,
    provider: "api-created",
  });
  const { city, country } = await ensureCountryAndCityFromLocation(meta);
  return { ...city, countryCode: country.code };
}

/**
 * Creates a city from a name and country code
 */
export async function createCityFromName(
  cityName: string,
  countryCodeInput?: string,
) {
  const geo = await geocodeCityFull(cityName, countryCodeInput);
  if (!geo) {
    throw new Error(`Could not find city: ${cityName}`);
  }

  return await createCityFromAPI(
    geo.name,
    geo.countryCode,
    geo.lat,
    geo.lng,
    geo.boundingbox,
    geo.state,
    geo.stateCode,
  );
}

/**
 * Finds or creates a city based on the given location
 * If jsonCityId is provided, it uses the local JSON source of truth.
 */
export async function findOrCreateCity(
  cityName: string,
  countryCode: string,
  coords: { lat: number; lng: number },
  jsonCityId?: number,
) {
  if (jsonCityId) {
    try {
      const city = await createCityFromJson(jsonCityId);
      return city;
    } catch (err) {
      console.warn(
        `Failed to create city from JSON ID ${jsonCityId}, falling back to legacy path:`,
        err,
      );
    }
  }

  const meta = buildCityMeta({
    name: cityName,
    countryCode,
    lat: coords.lat,
    lng: coords.lng,
    provider: "api-created",
  });

  const result = await ensureCountryAndCityFromLocation(meta);
  return result.city;
}

/**
 * Creates a city strictly from the local JSON source of truth.
 * If the city already exists (by externalId), returns the existing city.
 */
export async function createCityFromJson(jsonCityId: number) {
  const jsonCity = await JsonCityService.getCityById(jsonCityId);
  if (!jsonCity) {
    throw new Error(`City with JSON ID ${jsonCityId} not found.`);
  }

  // Check if city already exists by externalId (JSON ID)
  const { prisma } = await import("@/lib/db/prisma");
  const existingCity = await prisma.city.findUnique({
    where: { externalId: jsonCityId },
  });
  if (existingCity) {
    return existingCity;
  }

  const country = await findCountryByCode(jsonCity.countryCode);
  if (!country) {
    throw new Error(
      `Country ${jsonCity.countryCode} not found in DB. Please seed countries first.`,
    );
  }

  const stateName: string | null = jsonCity.stateName || null;
  const stateId = await ensureStateForCountry(
    country.id,
    country.code,
    jsonCity.stateName,
    jsonCity.stateCode,
    jsonCity.stateType,
  );

  const countrySlug = country.cca3.toLowerCase();
  const cityId = await generateUniqueCityId({
    cityName: jsonCity.name,
    countrySlug,
    stateCode: jsonCity.stateCode || undefined,
    stateName: jsonCity.stateName || undefined,
  });

  const coordsJson = {
    type: "Point",
    coordinates: [jsonCity.longitude, jsonCity.latitude],
  };

  const citySlug = jsonCity.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const slug = `${country.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${citySlug}`;

  // Enrich with LocationIQ data (BoundingBox, etc.)
  let boundingBoxJson = null;
  let radiusKm = 15;

  try {
    const { reverseGeocodeLocationIQ } =
      await import("@/domain/city/city-geocoding.service");
    const enriched = await reverseGeocodeLocationIQ(
      jsonCity.latitude,
      jsonCity.longitude,
    );

    if (enriched.boundingBox) {
      boundingBoxJson = {
        south: enriched.boundingBox[0],
        north: enriched.boundingBox[1],
        west: enriched.boundingBox[2],
        east: enriched.boundingBox[3],
      };
      radiusKm = estimateRadiusKmFromBBox(enriched.boundingBox);
    }
  } catch (error) {
    console.warn("Failed to enrich city with LocationIQ data:", error);
  }

  const city = await upsertCity(cityId, {
    name: jsonCity.name,
    countryRefId: country.id,
    stateId: stateId,
    stateName: stateName,
    coords: coordsJson,
    boundingBox: boundingBoxJson,
    radiusKm: radiusKm,
    autoCreated: true,
    needsReview: true,
    timeZone: jsonCity.timezone,
    externalId: jsonCityId, // Set the JSON ID to prevent duplicates
    wikiDataId: jsonCity.wikiDataId || null,
    slug: slug,
  });

  return city;
}

/**
 * Helper to generate unique city IDs with collision handling
 * Format: city-state-country (e.g., "san-francisco-ca-us")
 */
async function generateUniqueCityId(params: {
  cityName: string;
  countrySlug: string;
  stateCode?: string;
  stateName?: string;
}): Promise<string> {
  const { cityName, countrySlug, stateCode, stateName } = params;

  // Use stateCode if available, otherwise try stateName
  const stateSlug = stateCode || stateName;
  const cityId = makeCityId(cityName, countrySlug, stateSlug);

  const { isCityExists } = await import("@/lib/db/cityLocation.repo");
  const exists = await isCityExists(cityId);

  // If collision, append a counter
  if (exists) {
    let counter = 1;
    while (true) {
      const candidateId = `${cityId}-${counter}`;
      if (!(await isCityExists(candidateId))) {
        return candidateId;
      }
      counter++;
    }
  }

  return cityId;
}

/**
 * Helper to find or create a state for a given country
 */
async function ensureStateForCountry(
  countryId: string,
  countryCode: string,
  stateName?: string | null,
  stateCode?: string | null,
  stateType?: string | null,
): Promise<string | undefined> {
  if (!stateName && !stateCode) return undefined;

  const existingState = await findState(
    countryId,
    stateName || undefined,
    stateCode || undefined,
  );

  if (existingState) {
    return existingState.id;
  }

  const stateSlug = (stateName || stateCode || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  const newState = await createState({
    name: stateName || stateCode || "Unknown State",
    code: stateCode || null,
    countryRefId: countryId,
    type: stateType || null,
    slug: `${stateSlug}-${countryCode.toLowerCase()}`,
  });

  return newState.id;
}

/**
 * Ensures a country and city exist for the given location
 */
export async function ensureCountryAndCityFromLocation(
  meta: NonNullable<HomeBaseLocationMeta>,
) {
  const countryCode2 = meta.countryCode.toUpperCase();
  const countryName = meta.country || countryCode2;

  try {
    const countryId = countryCode2.toLowerCase();

    let country = await findCountryByCode(countryId);

    if (!country) {
      try {
        const { createCountryFromName } =
          await import("@/domain/country/country.service");
        const result = await createCountryFromName(countryName);
        country = result.country;
      } catch (err) {
        console.warn(`Failed to auto-generate country ${countryName}:`, err);
      }
    }

    if (!country) {
      throw new Error(`Country ${countryName} (${countryCode2}) not found.`);
    }

    const cityName = (meta.city || meta.displayName || "Unknown City").trim();

    if (!cityName || cityName.length < 2) {
      throw new Error("City name must be at least 2 characters long");
    }

    const cityId = await generateUniqueCityId({
      cityName,
      countrySlug: country.cca3,
      stateCode: meta.stateCode || undefined,
      stateName: meta.state || undefined,
    });
    const radiusKm = estimateRadiusKmFromBBox(
      meta.boundingBox as [number, number, number, number] | undefined,
    );

    const coordsJson = {
      type: "Point",
      coordinates: [meta.lon, meta.lat],
    };

    const boundingBoxJson = meta.boundingBox
      ? {
          south: meta.boundingBox[0],
          north: meta.boundingBox[1],
          west: meta.boundingBox[2],
          east: meta.boundingBox[3],
        }
      : null;

    const stateRefId = await ensureStateForCountry(
      country.id,
      country.code,
      meta.state,
      meta.stateCode,
      meta.stateType,
    );

    const city = await upsertCity(cityId, {
      name: cityName,
      countryRefId: country.id,
      stateId: stateRefId,
      stateName: meta.state,
      slug: `${country.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${cityName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      coords: coordsJson,
      boundingBox: boundingBoxJson,
      radiusKm,
      autoCreated: true,
      needsReview: true,
    });

    return { country, city };
  } catch (error) {
    console.error("ensureCountryAndCityFromLocation error:", error);
    throw new Error(
      `Database operation failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}
