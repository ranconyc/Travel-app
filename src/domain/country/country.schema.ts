import { z } from "zod";

export const CountrySchema = z.object({
  // --- CORE IDENTITY ---
  id: z.string().optional(), // MongoDB ObjectId
  cca3: z.string().length(3), // "THA"
  code: z.string().length(2), // "TH"
  name: z.string(),
  officialName: z.string().optional().nullable(),
  imageHeroUrl: z.string().url().optional().nullable(), // Curated cover image

  // REST Countries "Hidden Gems"
  population: z.number().optional(),
  areaKm2: z.number().optional(),
  borders: z.array(z.string()).optional(), // cca3 codes of neighbors
  tld: z.array(z.string()).optional(), // e.g. [".th"]
  independent: z.boolean().optional(),
  unMember: z.boolean().optional(),
  maps: z
    .object({
      googleMaps: z.string().url().optional(),
      openStreetMaps: z.string().url().optional(),
    })
    .optional()
    .nullable(),
  flags: z
    .object({
      png: z.string().url(),
      svg: z.string().url(),
      alt: z.string().optional(),
    })
    .optional()
    .nullable(),

  // GeoJSON Standard (optional to match Prisma)
  coords: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([
        z.number().min(-180).max(180), // Longitude
        z.number().min(-90).max(90), // Latitude
      ]),
    })
    .optional()
    .nullable(),

  // --- GEOGRAPHY & RELATIONS ---
  region: z.string().optional().nullable(),
  subRegion: z.string().optional().nullable(),
  capitalName: z.string().optional().nullable(),
  capitalId: z.string().optional().nullable(),

  // --- TRAVEL INSIGHTS ---
  logistics: z
    .object({
      car: z
        .object({
          side: z.enum(["left", "right"]),
          signs: z.array(z.string()),
        })
        .optional(),
      idd: z
        .object({
          root: z.string().optional(),
          suffixes: z.array(z.string()).optional(),
        })
        .optional(),
      electricity: z
        .object({
          voltage: z.number().int(), // e.g. 230
          frequency: z.number().int().optional(), // e.g. 50Hz
          // Note: plugs data moved to countryPlugs.json
        })
        .optional(),
      timezones: z.array(z.string()).optional(),
      startOfWeek: z.string().optional(),
      emergency: z
        .object({
          police: z.string(),
          ambulance: z.string(),
          fire: z.string(),
        })
        .optional(),
    })
    .optional()
    .nullable(),

  // Separate emergency field (from Prisma schema)
  emergency: z
    .object({
      police: z.string().optional(),
      touristPolice: z.string().optional(),
      ambulance: z.string().optional(),
      fire: z.string().optional(),
    })
    .optional()
    .nullable(),

  finance: z
    .object({
      currency: z.object({
        code: z.string(),
        symbol: z.string(),
        name: z.string(),
      }),
      avgDailyCost: z.object({
        budget: z.number(),
        mid: z.number(),
        luxury: z.number(),
        currencyCode: z.string().default("USD"),
      }),
      cashCulture: z.object({
        tipping: z.string(),
        atmAvailability: z.string(),
        atmFees: z.string().optional(),
        primaryPayment: z.string().optional(), // e.g. "Cash Preferred"
        tapToPay: z.boolean().optional(),
      }),
      // Note: detailed budget data moved to countryBudgets.json
    })
    .optional()
    .nullable(),

  // Culture (separate from logistics)
  culture: z
    .object({
      dressCode: z.string().optional(),
      taboos: z.array(z.string()).optional(),
      holidays: z
        .array(
          z.object({
            name: z.string(),
            date: z.string(),
          }),
        )
        .optional(),
    })
    .optional()
    .nullable(),

  // Note: visaInfo data moved to visas.json

  safety: z
    .object({
      overallScore: z.number().min(1).max(5),
      soloFemaleFriendly: z.number().min(1).max(5),
      crimeLevel: z.string(),
      scams: z
        .array(
          z.object({
            type: z.string(),
            severity: z.string(),
            tip: z.string(),
          }),
        )
        .default([]),
    })
    .optional()
    .nullable(),

  health: z
    .object({
      tapWaterSafe: z.boolean(),
      vaccines: z.array(z.string()),
      medicalStandard: z.string(),
    })
    .optional()
    .nullable(),

  seasons: z
    .object({
      peakMonths: z.array(z.number().min(1).max(12)),
      shoulderMonths: z.array(z.number().min(1).max(12)),
      bestTimeDisplay: z.string(),
    })
    .optional()
    .nullable(),

  languages: z
    .object({
      official: z.array(z.string()),
      spoken: z.array(z.string()).optional(),
      nativeName: z.string().optional(),
      codes: z.array(z.string()).optional(),
    })
    .optional()
    .nullable(),

  // Note: commonPhrases data moved to common_phrases.json

  // --- RELATIONS (optional, for when data is populated) ---
  cities: z.array(z.any()).optional(), // City[]
  states: z.array(z.any()).optional(), // State[]
  places: z.array(z.any()).optional(), // Place[]
  media: z.array(z.any()).optional(), // Media[]
  capitalCity: z.any().optional().nullable(), // City relation

  // --- META & TIMESTAMPS ---
  needsReview: z.boolean().default(true),
  autoCreated: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type Country = z.infer<typeof CountrySchema>;

export const CountryUpdateSchema = CountrySchema.partial();
export type CountryUpdateInput = z.infer<typeof CountryUpdateSchema>;
