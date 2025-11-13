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

/** Country Schema (aligned with Prisma `Country` model) */
export const CountrySchema = z.object({
  // Core identity
  id: z.string(), // Mongo ObjectId (string)
  countryId: z.string().min(1), // "thailand"
  code: z.string().min(1), // e.g. "TH"
  name: z.string().min(1),

  // Basic meta
  continent: z.string().optional(),
  subRegion: z.string().optional(),
  officialName: z.string().optional(),
  capital: z.string().optional(),
  regionCode: z.string().optional(),
  subRegionCode: z.string().optional(),
  population: z.number().int().optional(),
  areaKm2: z.number().optional(),

  // JSON fields (can be refined later if you want)
  currency: z
    .object({
      code: z.string(),
      name: z.string(),
      symbol: z.string(),
    })
    .optional(),
  emergency: z.unknown().optional(),
  visaEntry: z.unknown().optional(),
  languageComm: z.unknown().optional(),
  utilities: z.unknown().optional(),
  internet: z.unknown().optional(),

  // Transport UX
  gettingAround: z.array(TransportItem).optional(),

  // Media
  imageHeroUrl: z.string().url().optional(),
  images: z.array(z.string().url()).default([]),

  // Trip meta
  bestSeason: z.string().optional(),
  idealDuration: z.string().optional(),
  safety: z.string().optional(),

  regions: z.array(z.string()).default([]),

  // Capital relation
  capitalCityRefId: z.string().optional(),
  capitalCity: z.unknown().optional(),

  // Relations (lists)
  cities: z.array(z.unknown()).default([]),
  activities: z.array(z.unknown()).default([]),

  // CMS flags
  autoCreated: z.boolean().default(false),
  needsReview: z.boolean().default(false),

  // Timestamps (Prisma returns Date in JS)
  createdAt: z.date().optional(),
  updatedAt: z.date()..optional(),
});

export type Country = z.infer<typeof CountrySchema>;
