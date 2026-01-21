"use server";

import { z } from "zod";
import { createAdminAction, createPublicAction } from "@/lib/safe-action";
import {
  getAllCities,
  updateCity,
  deleteCity,
} from "@/lib/db/cityLocation.repo";
import {
  findOrCreateCity,
  ensureCountryAndCityFromLocation,
  findNearestCityFromCoords,
  createCityFromName,
} from "@/domain/city/city.service";
import { HomeBaseLocationMeta } from "@/domain/user/completeProfile.schema";
import { CityUpdateSchema } from "@/domain/city/city.schema";
export const getAllCitiesAction = createPublicAction(z.any(), async () => {
  const cities = await getAllCities();
  // Map to ensure relation arrays exist as per City schema
  return (cities || []).map((c) => ({
    ...c,
    places: [],
    usersHomeBase: [],
    usersCurrentCity: [],
  }));
});

export const findOrCreateCityAction = createPublicAction(
  z.object({
    cityName: z.string(),
    countryCode: z.string(),
    coords: z.object({ lat: z.number(), lng: z.number() }),
  }),
  async ({ cityName, countryCode, coords }) => {
    return await findOrCreateCity(cityName, countryCode, coords);
  },
);

export const ensureCountryAndCityFromLocationAction = createPublicAction(
  z.any(), // Assuming HomeBaseLocationMeta is validated elsewhere or just pass it through
  async (meta: HomeBaseLocationMeta) => {
    if (!meta) throw new Error("Metadata is required");
    return await ensureCountryAndCityFromLocation(meta);
  },
);

export const findNearestCityFromCoordsAction = createPublicAction(
  z.object({
    lat: z.number(),
    lng: z.number(),
    options: z
      .object({
        searchRadiusKm: z.number().optional(),
        createIfMissing: z.boolean().optional(),
      })
      .optional(),
  }),
  async ({ lat, lng, options }) => {
    return await findNearestCityFromCoords(lat, lng, options);
  },
);

export type GenerateCityResult = {
  cityId: string;
  name: string;
  countryCode: string;
  created: boolean;
};

export const generateCityAction = createAdminAction(
  z.object({
    cityName: z.string().min(2, "City name must be at least 2 characters"),
    countryCode: z.string().optional(),
  }),
  async ({ cityName, countryCode }) => {
    const city = await createCityFromName(cityName, countryCode);

    return {
      cityId: city.cityId,
      name: city.name,
      countryCode: city.countryCode,
      created: true,
    };
  },
);

export const updateCityAction = createAdminAction(
  z.object({
    id: z.string(),
    data: CityUpdateSchema,
  }),
  async ({ id, data }) => {
    return await updateCity(id, data);
  },
);

export const deleteCityAction = createAdminAction(
  z.object({ id: z.string() }),
  async ({ id }) => {
    await deleteCity(id);
  },
);
