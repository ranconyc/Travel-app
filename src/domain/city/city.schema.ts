import { z } from "zod";

export const CitySchema = z.object({
  id: z.string().optional(),
  cityId: z.string().min(2),
  name: z.string().min(2),
  countryRefId: z.string().optional().nullable(),
  isCapital: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  coords: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
  }),
  radiusKm: z.number().default(30),
  timeZone: z.string().optional().nullable(),
  boundingBox: z.any().optional().nullable(),
  imageHeroUrl: z.string().url().optional().nullable(),
  state: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  population: z.number().int().optional().nullable(),

  neighborhoods: z.array(z.string()).default([]),
  media: z.any().array().optional().default([]), // For UI displays
  country: z.any().optional().nullable(), // For inclusion
  places: z.any().array().optional().default([]), // For inclusion
  autoCreated: z.boolean().default(false),
  needsReview: z.boolean().default(false),
  aggregatedVibes: z.array(z.string()).default([]),
  discoveryScore: z.number().default(0.0),
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
  source: "db" | "db-bbox" | "locationiq" | "api-created" | "unknown";
  distanceKm: number | null;
  radiusKm: number | null;
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
};

/**
 * Geographic coordinates (latitude/longitude)
 */
export type Coords = {
  lat: number;
  lng: number;
};
