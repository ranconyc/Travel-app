import { z } from "zod";

export const CountrySchema = z.object({
  // --- CORE IDENTITY ---
  id: z.string().optional(), // MongoDB ObjectId
  cca3: z.string().length(3), // "ISR"
  code: z.string().length(2), // "IL"
  name: z.string(),
  officialName: z.string().optional().nullable(),
  imageHeroUrl: z.string().url().optional().nullable(),

  // Demographics
  population: z.number().optional(),
  areaKm2: z.number().optional(),
  region: z.string().optional().nullable(), // "Asia"
  subRegion: z.string().optional().nullable(), // "Western Asia"

  // Status Flags
  isIndependent: z.boolean().optional(),
  isUnMember: z.boolean().optional(),
  landlocked: z.boolean().optional(),

  // Arrays & Objects
  borders: z.array(z.string()).optional(), // ["EGY", "JOR"]
  altSpellings: z.array(z.string()).optional(),

  // Complex Objects
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

  coatOfArms: z.record(z.string(), z.string()).optional().nullable(), // { png: url, svg: url }
  demonyms: z.record(z.string(), z.any()).optional().nullable(), // { eng: { f, m } }

  // GeoJSON
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

  // --- DOMAIN DATA (Matches DB JSON) ---

  // 1. LOGISTICS
  // Old Zod had nested electricity etc. Actual DB: { idd, timezones, car, startOfWeek }
  logistics: z
    .object({
      idd: z
        .object({
          root: z.string().optional(),
          suffixes: z.array(z.string()).optional(),
        })
        .optional(),
      timezones: z.array(z.string()).optional(),
      car: z
        .object({
          side: z.enum(["left", "right"]).optional(),
          signs: z.array(z.string()).optional(),
        })
        .optional(),
      startOfWeek: z.string().optional(),
    })
    .optional()
    .nullable(),

  // 2. FINANCE
  // Actual DB: { currency: { code, name, symbol }, gini: { "2016": 39 } }
  finance: z
    .object({
      currency: z
        .object({
          code: z.string(),
          symbol: z.string().optional(),
          name: z.string().optional(),
        })
        .optional(),
      gini: z.record(z.string(), z.number()).optional(), // { "2016": 39 }
    })
    .optional()
    .nullable(),

  // 3. LANGUAGES
  // Actual DB is a Map: { ara: "Arabic", heb: "Hebrew" }
  languages: z.record(z.string(), z.string()).optional().nullable(),

  // Other Fields (Preserved for compatibility/legacy data)
  tld: z.array(z.string()).optional(),

  safety: z.record(z.string(), z.any()).optional().nullable(),
  emergency: z.record(z.string(), z.any()).optional().nullable(),
  health: z.record(z.string(), z.any()).optional().nullable(),
  seasons: z.record(z.string(), z.any()).optional().nullable(),
  culture: z.record(z.string(), z.any()).optional().nullable(),

  // --- RELATIONS ---
  cities: z.array(z.any()).optional(),
  states: z.array(z.any()).optional(),
  places: z.array(z.any()).optional(),
  media: z.array(z.any()).optional(),
  capitalName: z.string().optional().nullable(),
  capitalId: z.string().optional().nullable(),
  capitalCity: z.any().optional().nullable(),

  // --- META ---
  needsReview: z.boolean().default(false),
  autoCreated: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type Country = z.infer<typeof CountrySchema>;

export const CountryUpdateSchema = CountrySchema.partial();
export type CountryUpdateInput = z.infer<typeof CountryUpdateSchema>;
