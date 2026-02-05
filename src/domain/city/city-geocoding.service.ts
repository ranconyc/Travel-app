import "server-only";
import { ReverseGeocodeResult } from "@/domain/city/city.schema";

/**
 * Reverse geocodes a given point to a city using LocationIQ
 */
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
    // These parameters help get structured data
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

/**
 * Enhanced geocode city with full address details
 */
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

/**
 * Searches for cities using LocationIQ Autocomplete
 */
export async function searchCitiesExternal(query: string, limit = 10) {
  try {
    const key = process.env.LOCATIONIQ_API_KEY;
    if (!key) {
      console.warn("LOCATIONIQ_API_KEY not set, skipping external search");
      return [];
    }

    const url = new URL("https://api.locationiq.com/v1/autocomplete");
    url.searchParams.set("key", key);
    url.searchParams.set("q", query);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("normalizeaddress", "1");
    url.searchParams.set("dedupe", "1");
    url.searchParams.set("accept-language", "en");

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      console.error("LocationIQ search failed", res.status);
      return [];
    }

    const data = (await res.json()) as Array<{
      place_id: number;
      class: string;
      type: string;
      lat: string;
      lon: string;
      display_name: string;
      name: string;
      display_place?: string;
      address: {
        city?: string;
        town?: string;
        village?: string;
        country?: string;
        country_code?: string;
      };
      boundingbox?: string[];
      osm_id?: number;
      osm_type?: string;
    }>;

    // Filter to place/city types and normalize
    return data
      .filter(
        (item) =>
          item.type === "city" ||
          item.type === "town" ||
          item.type === "administrative",
      )
      .map((item) => {
        const lat = item.lat ? parseFloat(item.lat) : NaN;
        const lng = item.lon ? parseFloat(item.lon) : NaN;
        const cityName =
          item.address?.city ||
          item.address?.town ||
          item.address?.village ||
          item.display_place ||
          item.name;
        const countryName = item.address?.country || "";
        const countryCode = (item.address?.country_code || "").toUpperCase();

        const stateCode =
          (item.address as any)?.state_code?.toUpperCase() || "";
        return {
          id: `ext_${item.place_id}`,
          cityId: `${(cityName || "city").toLowerCase().replace(/\s+/g, "-")}-${(countryCode || "unknown").toLowerCase()}`,
          label: `${cityName}${stateCode ? `, ${stateCode}` : ""}, ${countryCode}`,
          subtitle: countryName || null,
          lat,
          lng,
          source: "external" as const,
          meta: {
            name: cityName,
            countryName,
            countryCode,
            lat,
            lng,
            placeId: item.place_id?.toString(),
            osmId: item.osm_id?.toString(),
            display_name: item.name,
            address: item.address as Record<string, unknown>,
            boundingbox: item.boundingbox?.map(Number) as [
              number,
              number,
              number,
              number,
            ],
          },
        };
      })
      .filter((c) => !Number.isNaN(c.lat) && !Number.isNaN(c.lng))
      .slice(0, limit);
  } catch (error) {
    console.error("searchCitiesExternal error:", error);
    return [];
  }
}
