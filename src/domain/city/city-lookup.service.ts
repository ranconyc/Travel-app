import { DetectedCity, CitySearchResult } from "@/domain/city/city.schema";
import { findCityByBBox, findNearestCity } from "@/lib/db/cityLocation.repo";
import { JsonCityService } from "@/domain/city/city-data.service";
import {
  reverseGeocodeLocationIQ,
  searchCitiesExternal,
} from "@/domain/city/city-geocoding.service";
import {
  createCityFromJson,
  createCityFromAPI,
} from "@/domain/city/city-creation.service";

/**
 * Finds the nearest city to the given coordinates
 */
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

  // 3. Try Local JSON Dataset (Global Fallback)
  try {
    const jsonCities = await JsonCityService.findNearestCities(
      lat,
      lng,
      1,
      100,
    );
    if (jsonCities.length > 0) {
      const bestMatch = jsonCities[0];
      const matchLabel = `${bestMatch.name}, ${bestMatch.countryCode}`;

      if (createIfMissing) {
        try {
          const newCity = await createCityFromJson(bestMatch.id);
          return {
            id: newCity.id,
            cityId: newCity.cityId,
            cityName: newCity.name,
            countryCode: bestMatch.countryCode,
            label: `${newCity.name}, ${bestMatch.countryCode}`,
            source: "json-db-created",
            distanceKm: bestMatch.distance,
            radiusKm: newCity.radiusKm,
            wikiDataId: newCity.wikiDataId,
          };
        } catch (err) {
          console.error("Failed to create city from JSON match:", err);
        }
      }

      return {
        id: null,
        cityId: null,
        cityName: bestMatch.name,
        countryCode: bestMatch.countryCode,
        label: matchLabel,
        source: "json",
        distanceKm: bestMatch.distance,
        radiusKm: null,
        wikiDataId: bestMatch.wikiDataId || null,
      };
    }
  } catch (err) {
    console.error("JsonCityService findNearestCities error:", err);
  }

  // 4. Final fallback to LocationIQ
  const external = await reverseGeocodeLocationIQ(lat, lng);

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

/**
 * Searches for cities in DB first, then falls back to JSON and LocationIQ
 */
export async function searchCitiesWithFallback(
  query: string,
  limit = 10,
): Promise<CitySearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  // 1. Try DB first
  const { searchCities } = await import("@/lib/db/cityLocation.repo");
  const localCities = await searchCities(trimmed, limit);

  if (localCities.length > 0) {
    return localCities.map((c) => {
      const stateCode = (c.state as any)?.code || "";
      const countryCode = (c.country as any)?.code || "";
      const coords = c.coords as unknown as {
        coordinates: [number, number];
      } | null;
      return {
        id: c.id,
        cityId: c.cityId,
        label: `${c.name}${stateCode ? `, ${stateCode}` : ""}, ${countryCode}`,
        subtitle: (c.country as any)?.name ?? null,
        lat: coords?.coordinates?.[1] ?? null,
        lng: coords?.coordinates?.[0] ?? null,
        source: "db" as const,
        dbCityId: c.id,
        countryCode: countryCode,
        stateCode: stateCode,
        wikiDataId: c.wikiDataId || undefined,
        meta: null,
      };
    });
  }

  // 2. Fallback to Local JSON Dataset
  try {
    const jsonResults = await JsonCityService.searchCities(trimmed, limit);
    if (jsonResults.length > 0) {
      return jsonResults
        .sort((a, b) => (b.countryPopulation || 0) - (a.countryPopulation || 0))
        .map((c) => ({
          id: `json_${c.id}`,
          cityId: `${c.name
            .toLowerCase()
            .replace(/\s+/g, "-")}-${c.countryCode.toLowerCase()}`,
          label: `${c.name}${c.stateCode ? `, ${c.stateCode}` : ""}, ${c.countryCode}`,
          subtitle: `${c.stateName} - ${c.countryName}`,
          lat: c.latitude,
          lng: c.longitude,
          source: "json",
          dbCityId: undefined,
          countryCode: c.countryCode,
          stateCode: c.stateCode,
          stateType: c.stateType,
          emoji: c.emoji,
          wikiDataId: c.wikiDataId,
          meta: {
            name: c.name,
            countryName: c.countryName,
            countryCode: c.countryCode,
            lat: c.latitude,
            lng: c.longitude,
          },
        }));
    }
  } catch (err) {
    console.error("JsonCityService search error:", err);
  }

  // 3. Fallback to LocationIQ
  return await searchCitiesExternal(trimmed, limit);
}
