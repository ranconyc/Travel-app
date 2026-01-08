import { z } from "zod";

/** Transportation item (used in country + city) */
export const TransportItem = z.object({
  name: z.string(),
  note: z.string().optional(),
  badge: z
    .object({
      text: z.string(),
      tone: z.enum(["green", "orange", "red", "blue", "neutral"]),
    })
    .optional(),
});

/** Detailed internal JSON blob for country metadata */
export const CountryMetaSchema = z.any();

/** Country Schema (aligned with Prisma `Country` model) */
export const CountrySchema = z.object({
  // Core identity
  id: z.string(), // Mongo ObjectId (string)
  countryId: z.string().min(1), // "thailand"
  code: z.string().min(1), // e.g. "TH"
  name: z.string().min(1),

  // Geospatial
  coords: z.any().optional().nullable(),

  // Basic meta
  continent: z.string().optional().nullable(),
  subRegion: z.string().optional().nullable(),
  officialName: z.string().optional().nullable(),
  capital: z.string().optional().nullable(),
  regionCode: z.string().optional().nullable(),
  subRegionCode: z.string().optional().nullable(),
  population: z.number().int().optional().nullable(),
  areaKm2: z.number().optional().nullable(),

  // JSON fields
  currency: z.any().optional().nullable(),
  emergency: z.any().optional().nullable(),
  visaEntry: z.any().optional().nullable(),
  languageComm: z.any().optional().nullable(),
  utilities: z.any().optional().nullable(),
  internet: z.any().optional().nullable(),

  // Transport UX
  gettingAround: z.any().optional().nullable(),

  // Media
  imageHeroUrl: z.string().url().optional().nullable(),
  images: z.array(z.string().url()).default([]),

  // Trip meta
  bestSeason: z.string().optional().nullable(),
  idealDuration: z.string().optional().nullable(),
  safety: z.string().optional().nullable(),

  // Detailed internal meta
  meta: CountryMetaSchema.optional().nullable(),
  regions: z.array(z.string()).default([]),

  // Capital relation
  capitalCityRefId: z.string().optional().nullable(),
  capitalCity: z.any().optional().nullable(),

  // Relations (Prisma relations are usually optional in the result if not included)
  cities: z.array(z.any()).optional(),
  activities: z.array(z.any()).optional(),

  // CMS flags
  autoCreated: z.boolean().default(false),
  needsReview: z.boolean().default(false),

  // Timestamps (Prisma returns Date in JS)
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Country = z.infer<typeof CountrySchema>;
export type CountryMeta = any;
