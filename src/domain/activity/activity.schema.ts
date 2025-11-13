// activity.schema.ts
import { z } from "zod";

export const DayHours = z.union([
  z.object({ closed: z.literal(true) }),
  z.object({
    closed: z.boolean().optional(),
    times: z
      .array(
        z.object({
          open: z.string(), // "09:00"
          close: z.string(), // "18:00"
        })
      )
      .min(1),
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

/** Activity Schema (aligned with Prisma `Activity` model + richer JSON typing) */
export const ActivitySchema = z.object({
  // Identity
  id: z.string().min(1),
  activityId: z.string().min(1), // Prisma: `activityId` unique
  slug: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().optional(),

  // Relations (NOTE: Prisma uses `cityRefId` / `countryRefId`)
  cityId: z.string().min(1),
  countryId: z.string().optional(),

  // Type & categories
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

  // Location
  address: z.string().optional(),
  coords: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  timeZone: z.string().optional(),
  neighborhood: z.string().optional(),

  // Ops
  openingHours: WeeklyHours.optional(), // Prisma: Json
  bestTimeToVisit: z.string().optional(),
  typicalVisitDuration: z.string().optional(),

  // Price
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

  // UX
  amenities: z.array(z.string()).default([]),
  accessibility: z.string().optional(),
  safetyNotes: z.string().optional(),
  crowdLevel: z.enum(["low", "moderate", "busy", "very-busy"]).optional(),
  haggling: z.enum(["not-applicable", "optional", "expected"]).optional(),
  photoTips: z.array(z.string()).default([]),

  // Media
  images: z
    .object({
      heroUrl: z.string().url().optional(),
      thumbUrl: z.string().url().optional(),
      gallery: z.array(z.string().url()).optional(),
    })
    .optional(),

  // CMS
  summary: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),

  // Flags + timestamps (from Prisma)
  autoCreated: z.boolean().default(false),
  needsReview: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Activity = z.infer<typeof ActivitySchema>;
