import { z } from "zod";
import { TransportItem } from "../country/country.schema";

/** Budget per-day string ranges */
const BudgetRangeSchema = z.object({
  budget: z.string().optional(), // e.g. "1200–1800"
  mid: z.string().optional(), // "2500–4300"
  luxury: z.string().optional(), // "6000+"
});

/** City Schema (matches Prisma) */
export const CitySchema = z.object({
  id: z.string(), // Mongo ObjectId
  cityId: z.string().min(1), // "bangkok-th"
  name: z.string(),

  countryRefId: z.string().min(1),
  country: z.unknown().optional(), // When included via Prisma include

  imageHeroUrl: z.string().url().optional(),
  images: z.array(z.string().url()).default([]),

  bestSeason: z.string().optional(),
  idealDuration: z.string().optional(),
  safety: z.string().optional(),

  neighborhoods: z
    .array(
      z.object({
        name: z.string(),
        vibe: z.array(z.string()).default([]),
        goodFor: z.array(z.string()).default([]),
      })
    )
    .default([]),

  /** Local currency per day */
  budget: BudgetRangeSchema.optional(),

  /** City-only transport recommendations */
  gettingAround: z.array(TransportItem).default([]),
});

export type City = z.infer<typeof CitySchema>;
