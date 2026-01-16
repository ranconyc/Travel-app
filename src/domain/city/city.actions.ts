"use server";

import {
  findOrCreateCity,
  ensureCountryAndCityFromLocation,
  findNearestCityFromCoords,
} from "@/lib/db/cityLocation.repo";
import { HomeBaseLocationMeta } from "@/domain/user/completeProfile.schema";

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
) {
  const result = await findNearestCityFromCoords(lat, lng, options);
  return result;
}
