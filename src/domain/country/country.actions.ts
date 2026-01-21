"use server";

import { z } from "zod";
import { createAdminAction, createPublicAction } from "@/lib/safe-action";
import {
  getAllCountries,
  updateCountry,
  deleteCountry,
} from "@/lib/db/country.repo";
import { createCountryFromName } from "@/domain/country/country.service";
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

export const getAllCountriesAction = createPublicAction(z.any(), async () => {
  return await getAllCountries();
});

export const updateCountryAction = createAdminAction(
  z.object({
    id: z.string(),
    data: CountryUpdateSchema,
  }),
  async ({ id, data }) => {
    return await updateCountry(id, data);
  },
);

export const deleteCountryAction = createAdminAction(
  z.object({ id: z.string() }),
  async ({ id }) => {
    await deleteCountry(id);
  },
);
