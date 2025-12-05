import { prisma } from "@/lib/db/prisma";
import type { HomeBaseLocationMeta } from "@/domain/user/completeProfile.schema";
import { NearestCityResult, ReverseGeocodeResult } from "@/types/city";

function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function makeCityId(cityName: string, countryCode2: string): string {
  const slug = slugify(cityName);
  return `${slug}-${countryCode2.toLowerCase()}`;
}
// get city by id
export async function getCityById(cityId: string) {
  console.log("finding city", cityId);
  try {
    return await prisma.city.findUnique({
      where: { cityId },
    });
  } catch (error) {
    console.error("getCityById error:", error);
    throw new Error("Failed to fetch city");
  }
}

// get all the CITIES in the DB in ascending order by name
export async function getAllCities() {
  try {
    return await prisma.city.findMany({
      orderBy: { name: "asc" },
    });
  } catch (err) {
    console.error("getAllCities error:", err);
    throw new Error("Failed to fetch cities");
  }
}

// find the nearest CITIES to a given point
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
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "dist_m",
          spherical: true,
          maxDistance: meters,
        },
      },
      { $limit: limit },
      {
        $project: {
          cityId: 1,
          name: 1,
          countryCode: 1,
          imageHeroUrl: 1,
          radiusKm: 1,
          distanceKm: { $divide: ["$dist_m", 1000] },
        },
      },
    ],
  });

  return (res as unknown as any[]).map(
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

// find the nearest CITY to a given point
export async function findNearestCity(
  lng: number,
  lat: number,
  km = 300
): Promise<NearestCityResult | null> {
  const [nearest] = await findNearbyCities(lng, lat, km, 1);
  return nearest ?? null;
}

// reverse geocode a given point to a city
export async function reverseGeocodeLocationIQ(
  lat: number,
  lng: number
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
      countryCode,
      label: city && countryCode ? `${city}, ${countryCode}` : city ?? null,
    };
  } catch (err) {
    console.error("reverseGeocodeLocationIQ error:", err);
    return { city: null, countryCode: null, label: null };
  }
}

function estimateRadiusKmFromBBox(
  bbox?: [number, number, number, number]
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
  }
): Promise<DetectedCity> {
  const searchRadiusKm = options?.searchRadiusKm ?? 500;
  const createIfMissing = options?.createIfMissing ?? false;

  const nearest = await findNearestCity(lng, lat, searchRadiusKm);
  console.log("nearest", nearest);

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

  const external = await reverseGeocodeLocationIQ(lat, lng);

  if (createIfMissing && external.city && external.countryCode) {
    try {
      const newCity = await createCityFromAPI(
        external.city,
        external.countryCode,
        lat,
        lng
      );

      return {
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
    cityId: null,
    cityName: external.city,
    countryCode: external.countryCode,
    label: external.label,
    source: external.label ? "locationiq" : "unknown",
    distanceKm: null,
    radiusKm: null,
  };
}

async function createCityFromAPI(
  cityName: string,
  countryCode: string,
  lat: number,
  lng: number
) {
  const meta = {
    city: cityName,
    displayName: cityName,
    country: countryCode,
    countryCode,
    lat,
    lon: lng,
    provider: "api-created",
    placeId: "unknown",
  };
  const { city, country } = await ensureCountryAndCityFromLocation(meta as any);
  return { ...city, countryCode: country.code };
}

export async function findOrCreateCity(
  cityName: string,
  countryCode: string,
  coords: { lat: number; lng: number }
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

export async function getCitiesWithCountry(slug: string) {
  try {
    const city = await prisma.city.findUnique({
      where: { cityId: slug },
      include: {
        country: true,
      },
    });

    if (!city) {
      throw new Error(`City not found: ${slug}`);
    }

    return city;
  } catch (err) {
    console.error("getCitiesWithCountry error:", err);
    throw new Error("Failed to fetch city");
  }
}

export async function ensureCountryAndCityFromLocation(
  meta: NonNullable<HomeBaseLocationMeta>
) {
  const countryCode2 = meta.countryCode.toUpperCase();
  const countryName = meta.country || countryCode2;

  try {
    const country = await prisma.country.upsert({
      where: {
        countryId: countryCode2.toLowerCase(),
      },
      update: {},
      create: {
        countryId: countryCode2.toLowerCase(),
        code: countryCode2,
        name: countryName,
      },
    });

    const cityName = (meta.city || meta.displayName || "Unknown City").trim();

    if (!cityName || cityName.length < 2) {
      throw new Error("City name must be at least 2 characters long");
    }

    const cityId = makeCityId(cityName, countryCode2);
    const radiusKm = estimateRadiusKmFromBBox(
      meta.boundingBox as [number, number, number, number] | undefined
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

    const city = await prisma.city.upsert({
      where: { cityId },
      update: {
        name: cityName,
        countryRefId: country.id,
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
      }`
    );
  }
}
