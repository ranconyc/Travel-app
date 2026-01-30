"use server";

import { z } from "zod";
import { createAdminAction, createPublicAction } from "@/lib/safe-action";
import {
  findOrCreateCity,
  ensureCountryAndCityFromLocation,
  findNearestCityFromCoords,
  createCityFromName,
  handleUpdateCity,
  handleDeleteCity,
  handleGetAllCities,
  searchCitiesWithFallback,
} from "@/domain/city/city.service";
import { homeBaseLocationMetaSchema } from "@/domain/user/completeProfile.schema";
import { CityUpdateSchema } from "@/domain/city/city.schema";

export const getAllCitiesAction = createPublicAction(
  z
    .object({ limit: z.number().optional(), offset: z.number().optional() })
    .optional(),
  async (params) => {
    const cities = await handleGetAllCities(params?.limit, params?.offset);
    // Map to ensure relation arrays exist as per City schema
    return (cities || []).map((c) => ({
      ...c,
      places: [],
      usersHomeBase: [],
      usersCurrentCity: [],
    }));
  },
);

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
  homeBaseLocationMetaSchema,
  async (meta) => {
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
    return await handleUpdateCity(id, data);
  },
);

export const searchCityAction = createPublicAction(
  z.object({ query: z.string().min(2), limit: z.number().optional() }),
  async ({ query, limit }) => {
    return await searchCitiesWithFallback(query, limit || 10);
  },
);

export const deleteCityAction = createAdminAction(
  z.object({ id: z.string() }),
  async ({ id }) => {
    await handleDeleteCity(id);
  },
);

export const getNearbyCitiesAction = createPublicAction(
  z.object({
    lat: z.number(),
    lng: z.number(),
    km: z.number().optional(),
    limit: z.number().optional(),
  }),
  async ({ lat, lng, km, limit }) => {
    const { findNearbyCities } = await import("@/lib/db/cityLocation.repo");
    const cities = await findNearbyCities(lng, lat, km, limit);
    return (cities || []).map((c) => ({
      ...c,
      places: [],
      usersHomeBase: [],
      usersCurrentCity: [],
    }));
  },
);
