import { z } from "zod";
import { CountrySchema } from "../country/country.schema";

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
  countryRefId: z.string().min(1),
  country: CountrySchema.optional(),

  // Capital meta
  isCapital: z.boolean().default(false),
  countryAsCapital: z.unknown().optional(),

  // Geo
  coords: GeoPointSchema,
  radiusKm: z.number().default(30),
  timeZone: z.string().optional(),
  boundingBox: z.unknown().optional(),

  // Climate & safety JSON blobs (can be refined later)
  climate: z.unknown().optional(),
  emergency: z.unknown().optional(),
  internet: z.unknown().optional(),

  // UX – images
  imageHeroUrl: z.string().url().optional(),
  images: z.array(z.string().url()).default([]),

  // Meta
  state: z.string().optional(),
  district: z.string().optional(),
  population: z.number().int().optional(),

  bestSeason: z.string().optional(),
  idealDuration: z.string().optional(),
  safety: z.string().optional(),

  neighborhoods: z.array(z.string()).default([]),

  // Money & moving around
  budget: BudgetSchema.optional(), // Prisma: Json
  gettingAround: z.record(z.string(), z.any()).default({}), // Prisma: Json

  // Relations
  activities: z.array(z.unknown()).default([]),

  usersHomeBase: z.array(z.unknown()).default([]),
  usersCurrentCity: z.array(z.unknown()).default([]),
  visitedByUsers: z.array(z.unknown()).default([]),
  wishListedByUsers: z.array(z.unknown()).default([]),

  // CMS flags
  autoCreated: z.boolean().default(false),
  needsReview: z.boolean().default(false),
});

export type City = z.infer<typeof CitySchema>;
