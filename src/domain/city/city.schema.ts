import { z } from "zod";

export const CitySchema = z.object({
  id: z.string().optional(),
  cityId: z.string().min(2),
  name: z.string().min(2),
  countryRefId: z.string().optional().nullable(),
  isCapital: z.boolean().default(false),
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
  bestSeason: z.string().optional().nullable(),
  idealDuration: z.string().optional().nullable(),
  safety: z.string().optional().nullable(),
  neighborhoods: z.array(z.string()).default([]),
  budget: z.any().optional().nullable(),
  gettingAround: z.any().optional().nullable(),
  media: z.any().array().optional().default([]), // For UI displays
  country: z.any().optional().nullable(), // For inclusion
  places: z.any().array().optional().default([]), // For inclusion
  autoCreated: z.boolean().default(false),
  needsReview: z.boolean().default(false),
});

export type City = z.infer<typeof CitySchema>;

export const CityUpdateSchema = CitySchema.partial();
export type CityUpdateInput = z.infer<typeof CityUpdateSchema>;
