"use server";

import {
  findOrCreateCity,
  ensureCountryAndCityFromLocation,
  findNearestCityFromCoords,
  getAllCities,
} from "@/lib/db/cityLocation.repo";
import { HomeBaseLocationMeta } from "@/domain/user/completeProfile.schema";
import { ActionResponse } from "@/types/actions";
import { DetectedCity } from "@/types/city";
import { City } from "@/domain/city/city.schema";
export async function getAllCitiesAction(): Promise<ActionResponse<City[]>> {
  try {
    const cities = await getAllCities();
    // Map to ensure relation arrays exist as per City schema
    const data = (cities || []).map((c) => ({
      ...c,
      places: [],
      usersHomeBase: [],
      usersCurrentCity: [],
    })) as unknown as City[];
    return { success: true, data };
  } catch (error) {
    console.error("getAllCitiesAction error:", error);
    return { success: false, error: "Failed to fetch cities" };
  }
}

export async function findOrCreateCityAction(
  cityName: string,
  countryCode: string,
  coords: { lat: number; lng: number }
) {
  const city = await findOrCreateCity(cityName, countryCode, coords);
  return city;
}

export async function ensureCountryAndCityFromLocationAction(
  meta: NonNullable<HomeBaseLocationMeta>
) {
  const result = await ensureCountryAndCityFromLocation(meta);
  return result;
}

export async function findNearestCityFromCoordsAction(
  lat: number,
  lng: number,
  options?: {
    searchRadiusKm?: number;
    createIfMissing?: boolean;
  }
): Promise<ActionResponse<DetectedCity>> {
  try {
    const result = await findNearestCityFromCoords(lat, lng, options);
    return { success: true, data: result };
  } catch (error) {
    console.error("findNearestCityFromCoordsAction error:", error);
    return { success: false, error: "Failed to find nearest city" };
  }
}
