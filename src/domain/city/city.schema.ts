import { z } from "zod";

export const CitySchema = z.object({
  id: z.string().optional(),
  cityId: z.string().min(2),
  name: z.string().min(2),
  slug: z.string().optional(),
  countryRefId: z.string().optional().nullable(),
  isCapital: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  coords: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
    })
    .optional()
    .nullable(),
  radiusKm: z.number().default(0),
  timeZone: z.string().optional().nullable(),
  boundingBox: z.any().optional().nullable(),
  imageHeroUrl: z.string().url().optional().nullable(),

  // State relations
  stateName: z.string().optional().nullable(),
  stateId: z.string().optional().nullable(),
  state: z.any().optional().nullable(), // For inclusion - will be stripped

  district: z.string().optional().nullable(),
  population: z.number().int().optional().nullable(),
  wikiDataId: z.string().optional().nullable(),
  googlePlaceId: z.string().optional().nullable(),
  isVerified: z.boolean().default(false),
  priority: z.number().default(0),

  neighborhoods: z.array(z.string()).default([]),
  media: z.any().array().optional().default([]), // For UI displays - will be stripped
  country: z.any().optional().nullable(), // For inclusion - will be stripped
  places: z.any().array().optional().default([]), // For inclusion - will be stripped
  autoCreated: z.boolean().default(false),
  needsReview: z.boolean().default(false),
  aggregatedVibes: z.array(z.string()).default([]),
  discoveryScore: z.number().default(0.0),

  // Extra fields from editor that may be present
  countryCode: z.string().optional().nullable(),
  description: z.any().optional().nullable(),
  budget: z.any().optional().nullable(),
  gettingAround: z.any().optional().nullable(),
  bestSeason: z.any().optional().nullable(),
  idealDuration: z.any().optional().nullable(),
  safety: z.any().optional().nullable(),
});

export type City = z.infer<typeof CitySchema>;

export const CityUpdateSchema = CitySchema.partial();
export type CityUpdateInput = z.infer<typeof CityUpdateSchema>;

/**
 * Detected city from user's location
 */
export type DetectedCity = {
  id: string | null;
  cityId: string | null;
  cityName: string | null;
  countryCode: string | null;
  label: string | null;
  source:
    | "db"
    | "db-bbox"
    | "locationiq"
    | "api-created"
    | "json"
    | "json-db-created"
    | "unknown";
  distanceKm: number | null;
  radiusKm: number | null;
  wikiDataId?: string | null;
};

/**
 * Result from reverse geocoding (coordinates to city name)
 */
export type ReverseGeocodeResult = {
  city: string | null;
  state?: string | null;
  stateCode?: string | null;
  countryCode: string | null;
  label: string | null;
  boundingBox?: [number, number, number, number];
};

/**
 * Result from nearest city search
 */
export type NearestCityResult = {
  id: string | null;
  cityId: string | null;
  name: string | null;
  countryCode: string | null;
  imageHeroUrl?: string | null;
  radiusKm?: number | null;
  distanceKm: number | null;
  wikiDataId?: string | null;
  country?: any;
};

/**
 * Geographic coordinates (latitude/longitude)
 */
export type Coords = {
  lat: number;
  lng: number;
};
/**
 * Common result format for city search (DB or external)
 */
export type CitySearchResult = {
  id: string; // uuid or ext_placeId
  cityId: string; // "country-city" slug
  label: string; // "City, Country"
  subtitle?: string | null;
  lat: number | null;
  lng: number | null;
  source: "db" | "external" | "json";
  dbCityId?: string;
  countryCode?: string;
  stateCode?: string;
  stateType?: string;
  wikiDataId?: string;
  meta?: {
    name: string;
    countryName: string;
    countryCode: string;
    lat: number;
    lng: number;
    placeId?: string;
    osmId?: string;
    display_name?: string;
    address?: Record<string, unknown>;
    boundingbox?: [number, number, number, number];
  } | null;
};
