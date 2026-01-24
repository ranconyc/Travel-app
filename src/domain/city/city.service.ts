import { prisma } from "@/lib/db/prisma";
import type { HomeBaseLocationMeta } from "@/domain/user/completeProfile.schema";
import { DetectedCity, ReverseGeocodeResult } from "@/types/city";
import {
  findCityByBBox,
  findNearestCity,
  makeCityId,
  updateCity,
  deleteCity,
} from "@/lib/db/cityLocation.repo";

// reverse geocode a given point to a city
export async function reverseGeocodeLocationIQ(
  lat: number,
  lng: number,
): Promise<ReverseGeocodeResult> {
  try {
    const key = process.env.LOCATIONIQ_API_KEY;
    if (!key) {
      throw new Error("Missing LOCATIONIQ_API_KEY env var");
    }

    const url = new URL("https://us1.locationiq.com/v1/reverse");
    url.searchParams.set("key", key);
    url.searchParams.set("lat", lat.toString());
    url.searchParams.set("lon", lng.toString());
    url.searchParams.set("format", "json");
    url.searchParams.set("accept-language", "en");
    url.searchParams.set("normalizecity", "1");
    url.searchParams.set("normalizeaddress", "1");
    url.searchParams.set("statecode", "1");
    url.searchParams.set("countrycode", "1");

    const res = await fetch(url.toString());

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
      state: address.state || null,
      stateCode: address.state_code
        ? String(address.state_code).toUpperCase()
        : null,
      countryCode,
      label: city && countryCode ? `${city}, ${countryCode}` : (city ?? null),
      boundingBox: data.boundingbox
        ? [
            parseFloat(data.boundingbox[0]),
            parseFloat(data.boundingbox[1]),
            parseFloat(data.boundingbox[2]),
            parseFloat(data.boundingbox[3]),
          ]
        : undefined,
    };
  } catch (err) {
    console.error("reverseGeocodeLocationIQ error:", err);
    return { city: null, countryCode: null, label: null };
  }
}

function estimateRadiusKmFromBBox(
  bbox?: [number, number, number, number],
): number {
  if (!bbox) return 30;
  const [south, north, west, east] = bbox;
  const latDiff = Math.abs(north - south);
  const lonDiff = Math.abs(east - west);
  const approxDeg = Math.max(latDiff, lonDiff);
  return Math.round((approxDeg * 111) / 2);
}

export async function findNearestCityFromCoords(
  lat: number,
  lng: number,
  options?: {
    searchRadiusKm?: number;
    createIfMissing?: boolean;
  },
): Promise<DetectedCity> {
  const searchRadiusKm = options?.searchRadiusKm ?? 500;
  const createIfMissing = options?.createIfMissing ?? false;

  // 1. Try Bounding Box check first
  const byBBox = await findCityByBBox(lat, lng);
  if (byBBox) {
    const label = byBBox.name ? `${byBBox.name}` : null;
    return {
      id: byBBox.id,
      cityId: byBBox.cityId,
      cityName: byBBox.name,
      countryCode: byBBox.countryCode,
      label,
      source: "db-bbox",
      distanceKm: 0,
      radiusKm: byBBox.radiusKm ?? null,
    };
  }

  // 2. Fallback to Nearest City (radius-based)
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
        : (nearest.name ?? null);

    return {
      id: nearest.id,
      cityId: nearest.cityId,
      cityName: nearest.name,
      countryCode: nearest.countryCode,
      label,
      source: "db",
      distanceKm: nearest.distanceKm,
      radiusKm: nearest.radiusKm,
    };
  }

  console.log(
    "[findNearestCityFromCoords] Resolving via LocationIQ...",
    lat,
    lng,
  );
  const external = await reverseGeocodeLocationIQ(lat, lng);
  console.log("[findNearestCityFromCoords] LocationIQ result:", external);

  if (createIfMissing && external.city && external.countryCode) {
    try {
      const newCity = await createCityFromAPI(
        external.city,
        external.countryCode,
        lat,
        lng,
        external.boundingBox,
        external.state,
        external.stateCode,
      );

      return {
        id: newCity.id,
        cityId: newCity.cityId,
        cityName: newCity.name,
        countryCode: newCity.countryCode,
        label: `${newCity.name}, ${newCity.countryCode}`,
        source: "api-created",
        distanceKm: 0,
        radiusKm: newCity.radiusKm,
      };
    } catch (error) {
      console.error("Failed to create city from API:", error);
    }
  }

  return {
    id: null,
    cityId: null,
    cityName: external.city,
    countryCode: external.countryCode,
    label: external.label,
    source: external.label ? "locationiq" : "unknown",
    distanceKm: null,
    radiusKm: null,
  };
}

// Improved geocode with address details
export async function geocodeCityFull(
  cityName: string,
  countryCodeInput?: string,
) {
  try {
    const key = process.env.LOCATIONIQ_API_KEY;
    if (!key) return null;

    const url = new URL("https://us1.locationiq.com/v1/search");
    url.searchParams.set("key", key);
    url.searchParams.set(
      "q",
      countryCodeInput ? `${cityName}, ${countryCodeInput}` : cityName,
    );
    url.searchParams.set("format", "json");
    url.searchParams.set("addressdetails", "1");
    // Ensure results are in English
    url.searchParams.set("accept-language", "en");
    url.searchParams.set("limit", "1");

    const res = await fetch(url.toString());
    console.log("locationiq geocode response:", res);
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return null;

    console.log("locationiq geocode data:", data);

    const item = data[0];
    const address = item.address || {};

    const foundCity =
      address.city ||
      address.town ||
      address.village ||
      address.suburb ||
      address.municipality ||
      cityName;
    const foundCountry = address.country_code
      ? String(address.country_code).toUpperCase()
      : countryCodeInput || "UNKNOWN";

    return {
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      boundingbox: item.boundingbox
        ? ([
            parseFloat(item.boundingbox[0]),
            parseFloat(item.boundingbox[1]),
            parseFloat(item.boundingbox[2]),
            parseFloat(item.boundingbox[3]),
          ] as [number, number, number, number])
        : undefined,
      name: foundCity,
      state: address.state || null,
      stateCode: address.state_code
        ? String(address.state_code).toUpperCase()
        : null,
      countryCode: foundCountry,
      displayName: item.display_name,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function createCityFromAPI(
  cityName: string,
  countryCode: string,
  lat: number,
  lng: number,
  boundingbox?: [number, number, number, number],
  state?: string | null,
  stateCode?: string | null,
) {
  const meta = {
    city: cityName,
    displayName: cityName,
    state: state || null,
    stateCode: stateCode || null,
    country: countryCode,
    countryCode,
    lat,
    lon: lng,
    boundingBox: boundingbox,
    provider: "api-created",
    placeId: "unknown",
  };
  const { city, country } = await ensureCountryAndCityFromLocation(meta as any);
  return { ...city, countryCode: country.code };
}

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
    (geo as any).state,
    (geo as any).stateCode,
  );
}

export async function findOrCreateCity(
  cityName: string,
  countryCode: string,
  coords: { lat: number; lng: number },
) {
  const meta: HomeBaseLocationMeta = {
    city: cityName,
    displayName: cityName,
    country: countryCode,
    countryCode,
    lat: coords.lat,
    lon: coords.lng,
    boundingBox: undefined,
    provider: "api-created",
    placeId: "unknown",
  };

  const result = await ensureCountryAndCityFromLocation(meta as any);
  return result.city;
}

export async function ensureCountryAndCityFromLocation(
  meta: NonNullable<HomeBaseLocationMeta>,
) {
  const countryCode2 = meta.countryCode.toUpperCase();
  const countryName = meta.country || countryCode2;

  try {
    const countryId = countryCode2.toLowerCase();

    // Check if country exists
    let country = await prisma.country.findUnique({
      where: { cca3: countryId.toUpperCase() },
    });

    // If country does not exist, try to generate it fully first
    if (!country) {
      try {
        const { createCountryFromName } =
          await import("@/domain/country/country.service");
        const result = await createCountryFromName(countryName);
        country = result.country;
        console.log(`Auto-generated missing country: ${country.name}`);
      } catch (err) {
        console.warn(
          `Failed to auto-generate full country details for ${countryName}, falling back to stub:`,
          err,
        );
      }
    }

    if (!country) {
      throw new Error(
        `Country ${countryName} (${countryCode2}) not found and could not be auto-generated.`,
      );
    }

    const cityName = (meta.city || meta.displayName || "Unknown City").trim();

    if (!cityName || cityName.length < 2) {
      throw new Error("City name must be at least 2 characters long");
    }

    const cityId = makeCityId(cityName, countryCode2);
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

    // --- HANDLE STATE ---
    let stateRefId: string | undefined = undefined;
    if (meta.state || meta.stateCode) {
      // Try to find existing state
      const existingState = await prisma.state.findFirst({
        where: {
          countryRefId: country.id,
          OR: [
            {
              code: {
                equals: meta.stateCode || undefined,
                mode: "insensitive",
              },
            },
            { name: { equals: meta.state || undefined, mode: "insensitive" } },
          ],
        },
      });

      if (existingState) {
        stateRefId = existingState.id;
      } else {
        // Create new State
        const newState = await prisma.state.create({
          data: {
            name: meta.state || meta.stateCode || "Unknown State",
            code: meta.stateCode || null,
            countryRefId: country.id,
            // stateId is optional, so we leave it out (null)
          },
        });
        stateRefId = newState.id;
      }
    }

    const city = await prisma.city.upsert({
      where: { cityId },
      update: {
        name: cityName,
        countryRefId: country.id,
        stateId: stateRefId,
        stateName: meta.state,
        coords: coordsJson,
        boundingBox: boundingBoxJson,
        radiusKm,
        autoCreated: true,
        needsReview: true,
      },
      create: {
        cityId,
        name: cityName,
        countryRefId: country.id,
        stateId: stateRefId,
        stateName: meta.state,
        coords: coordsJson,
        boundingBox: boundingBoxJson,
        radiusKm,
        autoCreated: true,
        needsReview: true,
      },
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

export async function handleUpdateCity(id: string, data: any) {
  return await updateCity(id, data);
}

export async function handleDeleteCity(id: string) {
  return await deleteCity(id);
}
export async function handleGetAllCities(limit?: number, offset?: number) {
  const { getAllCities } = await import("@/lib/db/cityLocation.repo");
  return await getAllCities(limit, offset);
}
