import { z } from "zod";
import { CountrySchema } from "@/domain/country/country.schema";

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

/** City Schema (aligned with Prisma `City` model) */
export const CitySchema = z.object({
  // Identity
  id: z.string().optional(), // Mongo ObjectId
  cityId: z.string().min(1),
  name: z.string().min(1),

  // Country relation
  countryRefId: z.string().nullable().optional(),
  country: CountrySchema.optional().nullable(),

  isCapital: z.boolean().default(false),

  // Geo
  coords: GeoPointSchema,
  radiusKm: z.number().default(30),
  timeZone: z.string().optional().nullable(),
  boundingBox: z.any().optional().nullable(),

  // Media
  imageHeroUrl: z.string().url().optional().nullable(),
  media: z.array(z.any()).optional(),

  // Meta
  state: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  population: z.number().int().optional().nullable(),
  bestSeason: z.string().optional().nullable(),
  idealDuration: z.string().optional().nullable(),
  safety: z.string().optional().nullable(),
  neighborhoods: z.array(z.string()).default([]),

  // Money & moving around
  budget: BudgetSchema.optional().nullable(),
  gettingAround: z.any().optional().nullable(),

  // Relations
  places: z.array(z.any()).optional().default([]),

  usersHomeBase: z.array(z.any()).optional().default([]),
  usersCurrentCity: z.array(z.any()).optional().default([]),

  // CMS flags
  autoCreated: z.boolean().default(false),
  needsReview: z.boolean().default(false),
});

export type City = z.infer<typeof CitySchema>;

/** Update schema - all fields optional for partial updates */
export const CityUpdateSchema = CitySchema.partial().omit({
  id: true,
  places: true,
  usersHomeBase: true,
  usersCurrentCity: true,
  country: true,
});

export type CityUpdate = z.infer<typeof CityUpdateSchema>;
