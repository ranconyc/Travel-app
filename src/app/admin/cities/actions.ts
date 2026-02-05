"use server";

import { JsonCityService } from "@/domain/city/city-data.service";
import { type JsonCitySearchResult } from "@/domain/city/city-data.types";

export type CitySearchResult = JsonCitySearchResult;

export async function searchCities(query: string): Promise<CitySearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  // Check if query is a coordinate pair (lat, lng)
  const coordMatch = trimmed.match(
    /^([-+]?\d{1,2}(?:\.\d+)?),\s*([-+]?\d{1,3}(?:\.\d+)?)$/,
  );

  if (coordMatch) {
    const targetLat = parseFloat(coordMatch[1]);
    const targetLng = parseFloat(coordMatch[2]);

    const results = await JsonCityService.findNearestCities(
      targetLat,
      targetLng,
      50,
    );
    // Remove 'distance' property to match return type
    return results.map(({ distance: _, ...rest }) => rest);
  }

  // Text search
  return await JsonCityService.searchCities(trimmed);
}
