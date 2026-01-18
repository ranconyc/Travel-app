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
  currency: z
    .object({
      code: z.string(),
      symbol: z.string(),
      name: z.string(),
      subunit: z.string().optional(),
      subunitToUnit: z.number().optional(),
    })
    .optional()
    .nullable(),

  budget: z
    .object({
      daily: z
        .object({
          budget: z.string(),
          mid: z.string(),
          luxury: z.string(),
        })
        .optional(),
      currencyCode: z.string().optional(),
      note: z.string().optional(),
    })
    .optional()
    .nullable(),

  cashCulture: z
    .object({
      atmAvailability: z.string().optional(),
      creditCardAcceptance: z.string().optional(),
      cashPreferred: z.boolean().optional(),
      tipping: z.any().optional(), // Or detailed schema
    })
    .optional()
    .nullable(),

  languages: z
    .object({
      official: z.array(z.string()).optional(),
      spoken: z.array(z.string()).optional(),
      nativeName: z.string().optional(),
      primaryScript: z.string().optional(),
    })
    .optional()
    .nullable(),

  commonPhrases: z
    .array(
      z.object({
        label: z.string(),
        local: z.string(),
        romanized: z.string().optional(),
        pronunciation: z.string().optional(),
        category: z.string().optional(),
      }),
    )
    .optional()
    .nullable(),

  emergency: z
    .object({
      police: z.string().optional(),
      ambulance: z.string().optional(),
      fire: z.string().optional(),
      touristPolice: z.string().optional(),
    })
    .optional()
    .nullable(),

  visaEntry: z.any().optional().nullable(),
  utilities: z.any().optional().nullable(),
  internet: z.any().optional().nullable(),

  // Transport UX
  gettingAround: z.any().optional().nullable(),

  // Media (Now using relation + simple hero string for speed)
  imageHeroUrl: z.string().optional().nullable(),
  media: z.array(z.any()).optional(),

  // Trip meta
  bestTimeToVisit: z.any().optional().nullable(),
  idealDuration: z.string().optional().nullable(),

  safety: z
    .object({
      overall: z.string().optional(),
      rating: z.number().optional(),
      crimeLevel: z.string().optional(),
      scamsCommon: z
        .array(
          z.object({
            type: z.string(),
            severity: z.string(),
            tip: z.string(),
          }),
        )
        .optional(),
      areasCaution: z.array(z.any()).optional(),
    })
    .optional()
    .nullable(),

  // Detailed internal meta
  meta: CountryMetaSchema.optional().nullable(),
  regions: z.array(z.string()).default([]),

  // Relations
  cities: z.array(z.any()).optional(),
  places: z.array(z.any()).optional(),

  // CMS flags
  autoCreated: z.boolean().default(false),
  needsReview: z.boolean().default(false),

  // Timestamps (Prisma returns Date in JS)
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Country = z.infer<typeof CountrySchema>;
export type CountryMeta = any;

/** Update schema - all fields optional for partial updates */
export const CountryUpdateSchema = CountrySchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  cities: true,
  places: true,
  usersHomeBase: true,
});

export type CountryUpdate = z.infer<typeof CountryUpdateSchema>;
