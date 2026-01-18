import { prisma } from "@/lib/db/prisma";
import type { HomeBaseLocationMeta } from "@/domain/user/completeProfile.schema";
import {
  DetectedCity,
  NearestCityResult,
  ReverseGeocodeResult,
} from "@/types/city";

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
      include: { country: true },
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
  limit = 10,
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
          _id: 1, // Include the ObjectId
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
    (row): NearestCityResult & { id: string } => ({
      id: row._id?.["$oid"] || row._id, // Handle Mongo raw result often being {_id: {$oid: "..."}}
      cityId: row.cityId ?? null,
      name: row.name ?? null,
      countryCode: row.countryCode ?? null,
      imageHeroUrl: row.imageHeroUrl ?? null,
      radiusKm: typeof row.radiusKm === "number" ? row.radiusKm : null,
      distanceKm: typeof row.distanceKm === "number" ? row.distanceKm : null,
    }),
  );
}

// find the nearest CITY to a given point
export async function findNearestCity(
  lng: number,
  lat: number,
  km = 300,
): Promise<NearestCityResult | null> {
  const [nearest] = await findNearbyCities(lng, lat, km, 1);
  return nearest ?? null;
}

// find city by bounding box
export async function findCityByBBox(
  lat: number,
  lng: number,
): Promise<NearestCityResult | null> {
  try {
    // We use aggregateRaw to check if the point [lng, lat] is within the boundingBox
    // The boundingBox is stored as { south, north, west, east }
    const res = await prisma.city.findRaw({
      filter: {
        "boundingBox.south": { $lte: lat },
        "boundingBox.north": { $gte: lat },
        "boundingBox.west": { $lte: lng },
        "boundingBox.east": { $gte: lng },
      },
    });

    const results = res as unknown as any[];
    if (!results || results.length === 0) return null;

    const city = results[0];

    return {
      id: city._id?.["$oid"] || city._id,
      cityId: city.cityId || null,
      name: city.name || null,
      countryCode: null,
      imageHeroUrl: city.imageHeroUrl || null,
      radiusKm: city.radiusKm || null,
      distanceKm: 0,
    };
  } catch (error) {
    console.error("findCityByBBox error:", error);
    return null;
  }
}

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

    console.log("reverseGeocodeLocationIQ ---------> ", res);

    if (!res.ok) {
      throw new Error(`LocationIQ reverse failed: ${res.status}`);
    }

    const data = await res.json();
    const address = data.address ?? {};

    console.log("reverseGeocodeLocationIQ ---------> ", data);

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
  // console.log("nearest", nearest);

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
      id: nearest.id, // Return valid ObjectId
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
        lng,
        external.boundingBox,
      );

      return {
        id: newCity.id, // Return valid ObjectId
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

// geocode a given city name to coords
export async function geocodeLocationIQ(
  cityName: string,
  countryCode?: string,
): Promise<{
  lat: number;
  lng: number;
  boundingbox: string[];
  display_name: string;
  countryCode: string;
} | null> {
  try {
    const key = process.env.LOCATIONIQ_API_KEY;
    if (!key) {
      throw new Error("Missing LOCATIONIQ_API_KEY env var");
    }

    const url = new URL("https://us1.locationiq.com/v1/search");
    url.searchParams.set("key", key);
    let q = cityName;
    if (countryCode) q += `, ${countryCode}`;
    url.searchParams.set("q", q);
    url.searchParams.set("format", "json");
    url.searchParams.set("accept-language", "en");
    url.searchParams.set("limit", "1");

    const res = await fetch(url.toString());

    if (!res.ok) {
      console.error(`LocationIQ search failed: ${res.status}`);
      return null;
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const item = data[0];
    // console.log("geocodeLocationIQ", item);

    // Extract country code from address if available, or try to guess?
    // LocationIQ search result usually has `address` if we add addressdetails=1
    // Re-fetch with addressdetails=1 to be sure? Or assume user provided countryCode is correct?

    // Let's try to parse country code from display_name if not provided?
    // Actually, let's use a specialized structured query if country provided?
    // For now, simpler is better.

    // To get country code reliable, use addressdetails=1
    // ...

    return {
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      boundingbox: item.boundingbox,
      display_name: item.display_name,
      countryCode: countryCode || "UNKNOWN", // we might need to fetch address details to get real country code
    };
  } catch (err) {
    console.error("geocodeLocationIQ error:", err);
    return null;
  }
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
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return null;

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
) {
  const meta = {
    city: cityName,
    displayName: cityName,
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
  // 1. Geocode
  const geo = await geocodeCityFull(cityName, countryCodeInput);
  if (!geo) {
    throw new Error(`Could not find city: ${cityName}`);
  }

  // 2. Create
  console.log("Found city via API:", geo);

  return await createCityFromAPI(
    geo.name,
    geo.countryCode,
    geo.lat,
    geo.lng,
    geo.boundingbox,
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
  meta: NonNullable<HomeBaseLocationMeta>,
) {
  const countryCode2 = meta.countryCode.toUpperCase();
  const countryName = meta.country || countryCode2;

  try {
    const countryId = countryCode2.toLowerCase();

    // Check if country exists
    let country = await prisma.country.findUnique({
      where: { countryId },
    });

    // If country does not exist, try to generate it fully first
    if (!country) {
      try {
        // Dynamic import to avoid circular dependency
        const { createCountryFromName } = await import("@/lib/db/country.repo");
        // Use the country name from meta, or default to code if name missing (though name is usually present from geocode)
        // Note: RestCountries search works best with full names e.g. "France", "United States"
        // If we only have "US", it might be ambiguous for 'name' search without fullText=false?
        // createCountryFromName handles name search.
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

    // Fallback or ensure upsert if createCountryFromName failed or wasn't called
    if (!country) {
      country = await prisma.country.upsert({
        where: {
          countryId,
        },
        update: {},
        create: {
          countryId,
          code: countryCode2,
          name: countryName,
          currency: {
            code: "USD",
            symbol: "$",
            name: "US Dollar",
          },
          budget: {
            daily: { budget: "50-100", mid: "100-250", luxury: "250+" },
            currencyCode: "USD",
          },
          cashCulture: {
            atmAvailability: "widespread",
            cashPreferred: false,
          },
          bestTimeToVisit: {
            peak: { months: [], why: "", crowds: "", prices: "" },
          } as unknown as any,
        } as any,
      });
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
      }`,
    );
  }
}

export async function isCityExists(cityId: string) {
  const city = await prisma.city.findUnique({ where: { cityId } });
  return !!city;
}

export async function updateCity(id: string, data: any) {
  try {
    return await prisma.city.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("updateCity error:", error);
    throw new Error("Failed to update city");
  }
}

export async function deleteCity(id: string) {
  try {
    return await prisma.city.delete({
      where: { id },
    });
  } catch (error) {
    console.error("deleteCity error:", error);
    throw new Error("Failed to delete city");
  }
}
