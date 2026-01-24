"use server";

import { z } from "zod";
import { createAdminAction, createPublicAction } from "@/lib/safe-action";
import {
  createCountryFromName,
  handleUpdateCountry,
  handleDeleteCountry,
  handleGetAllCountries,
} from "@/domain/country/country.service";
import { CountryUpdateSchema } from "@/domain/country/country.schema";

export type GenerateCountryResult = {
  cca3: string;
  name: string;
  created: boolean;
};

export const generateCountryAction = createAdminAction(
  z.object({ name: z.string().min(2, "Name must be at least 2 characters") }),
  async ({ name }) => {
    const { country, created } = await createCountryFromName(name);

    return {
      cca3: country.cca3,
      name: country.name,
      created,
    };
  },
);

export const getAllCountriesAction = createPublicAction(
  z
    .object({ limit: z.number().optional(), offset: z.number().optional() })
    .optional(),
  async (params) => {
    return await handleGetAllCountries(params?.limit, params?.offset);
  },
);

export const updateCountryAction = createAdminAction(
  z.object({
    id: z.string(),
    data: CountryUpdateSchema,
  }),
  async ({ id, data }) => {
    return await handleUpdateCountry(id, data);
  },
);

export const deleteCountryAction = createAdminAction(
  z.object({ id: z.string() }),
  async ({ id }) => {
    await handleDeleteCountry(id);
  },
);

export const getNearbyCountriesAction = createPublicAction(
  z.object({
    lng: z.number(),
    lat: z.number(),
    limit: z.number().optional(),
  }),
  async ({ lng, lat, limit }) => {
    const { findNearbyCountries } = await import("@/lib/db/country.repo");
    return await findNearbyCountries(lng, lat, limit);
  },
);
