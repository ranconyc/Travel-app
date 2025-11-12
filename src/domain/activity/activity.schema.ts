// activity.schema.ts
import { z } from "zod";

export const DayHours = z.union([
  z.object({ closed: z.literal(true) }),
  z.object({
    closed: z.boolean().optional(),
    times: z.array(z.object({ open: z.string(), close: z.string() })).min(1),
  }),
]);

export const WeeklyHours = z.object({
  mon: DayHours.optional(),
  tue: DayHours.optional(),
  wed: DayHours.optional(),
  thu: DayHours.optional(),
  fri: DayHours.optional(),
  sat: DayHours.optional(),
  sun: DayHours.optional(),
});

export const ActivitySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().optional(),
  cityId: z.string().min(1),
  countryId: z.string().optional(),
  type: z.enum([
    "market",
    "museum",
    "landmark",
    "park",
    "food",
    "nightlife",
    "shopping",
    "experience",
  ]),
  categories: z.array(z.string()).default([]),

  address: z.string().optional(),
  coords: z.object({ lat: z.number(), lng: z.number() }).optional(),
  timeZone: z.string().optional(),
  neighborhood: z.string().optional(),

  openingHours: WeeklyHours.optional(),
  bestTimeToVisit: z.string().optional(),
  typicalVisitDuration: z.string().optional(),

  entryPrice: z
    .object({
      currencyCode: z.string().min(1),
      range: z.string().optional(),
      note: z.string().optional(),
      badges: z
        .array(
          z.object({
            text: z.string(),
            tone: z.enum(["green", "orange", "red", "blue", "neutral"]),
          })
        )
        .optional(),
    })
    .optional(),

  amenities: z.array(z.string()).default([]),
  accessibility: z.string().optional(),
  safetyNotes: z.string().optional(),
  crowdLevel: z.enum(["low", "moderate", "busy", "very-busy"]).optional(),
  haggling: z.enum(["not-applicable", "optional", "expected"]).optional(),
  photoTips: z.array(z.string()).default([]),

  images: z
    .object({
      heroUrl: z.string().url().optional(),
      thumbUrl: z.string().url().optional(),
      gallery: z.array(z.string().url()).optional(),
    })
    .optional(),

  summary: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});
export type Activity = z.infer<typeof ActivitySchema>;
