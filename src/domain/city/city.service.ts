/**
 * City Service - Unified exports and simple CRUD operations
 *
 * This module re-exports from specialized services:
 * - city-lookup.service.ts: Find and search operations
 * - city-creation.service.ts: Create and ensure operations
 * - city-geocoding.service.ts: External API geocoding
 * - city-data.service.ts: Local JSON data access
 */

import { updateCity, deleteCity } from "@/lib/db/cityLocation.repo";

// Re-export lookup functions
export {
  findNearestCityFromCoords,
  searchCitiesWithFallback,
} from "@/domain/city/city-lookup.service";

// Re-export creation functions
export {
  createCityFromAPI,
  createCityFromName,
  createCityFromJson,
  findOrCreateCity,
  ensureCountryAndCityFromLocation,
} from "@/domain/city/city-creation.service";

// Re-export types
export type { DetectedCity, CitySearchResult } from "@/domain/city/city.schema";

/**
 * Updates a city in the database
 */
export async function handleUpdateCity(
  id: string,
  data: Parameters<typeof updateCity>[1],
) {
  return await updateCity(id, data);
}

/**
 * Deletes a city from the database
 */
export async function handleDeleteCity(id: string) {
  return await deleteCity(id);
}

/**
 * Returns all cities in the database
 */
export async function handleGetAllCities(limit?: number, offset?: number) {
  const { getAllCities } = await import("@/lib/db/cityLocation.repo");
  return await getAllCities(limit, offset);
}
