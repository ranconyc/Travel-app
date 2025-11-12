// domain/city/city.schema.ts
import { z } from "zod";
import { TransportItem } from "../country/country.schema";

/** Budget per-day (in local currency) */
export const BudgetSchema = z.object({
  currency: z.string().optional(),
  perDayMin: z.number().optional(),
  perDayMax: z.number().optional(),
  notes: z.string().optional(),
});

/** GeoJSON Point */
export const GeoPointSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
});

/** City Schema (matches Prisma + seed JSON) */
export const CitySchema = z.object({
  id: z.string().optional(), // Mongo ObjectId
  cityId: z.string().min(1),
  name: z.string(),

  countryRefId: z.string().min(1),
  country: z.unknown().optional(),

  coords: GeoPointSchema,
  radiusKm: z.number(),

  imageHeroUrl: z.string().url().optional(),
  images: z.array(z.string().url()).default([]),

  bestSeason: z.string().optional(),
  idealDuration: z.string().optional(),
  safety: z.string().optional(),

  neighborhoods: z.array(z.string()).default([]),

  budget: BudgetSchema.optional(),
  gettingAround: z.record(z.string()).default({}), // flexible key:value
  activities: z.array(z.unknown()).default([]),
});

export type City = z.infer<typeof CitySchema>;
