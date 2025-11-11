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

/** Country Schema (matches Prisma model exactly) */
export const CountrySchema = z.object({
  id: z.string(), // Mongo ObjectId (string)
  countryId: z.string().min(1), // "thailand"
  code: z.string().length(2), // "TH"
  name: z.string(),

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

  gettingAround: z.array(TransportItem).optional(),

  imageHeroUrl: z.string().url().optional(),
  images: z.array(z.string().url()).default([]),

  bestSeason: z.string().optional(),
  idealDuration: z.string().optional(),
  safety: z.string().optional(),

  regions: z.array(z.string()).default([]),
});

export type Country = z.infer<typeof CountrySchema>;
