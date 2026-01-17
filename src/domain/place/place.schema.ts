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
        }),
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

/** Place Schema (aligned with Prisma `Place` model) */
export const PlaceSchema = z.object({
  // Identity
  id: z.string().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  altName: z.string().optional().nullable(),

  // Relations
  cityRefId: z.string().min(1),
  countryRefId: z.string().optional().nullable(),

  // Classification
  type: z.string(), // "RESTAURANT", "LANDMARK", "MUSEUM"
  categories: z.array(z.string()).default([]),
  mapIcon: z.string().optional().nullable(),

  // Location
  address: z.string().optional().nullable(),
  coords: z.any(), // GeoJSON Point
  timeZone: z.string().optional().nullable(),
  neighborhood: z.string().optional().nullable(),

  // Contact / Info
  websiteUrl: z.string().url().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  googlePlaceId: z.string().optional().nullable(),

  // Ops
  openingHours: WeeklyHours.optional().nullable(),
  isPermanentlyClosed: z.boolean().default(false),
  bestTimeToVisit: z.string().optional().nullable(),
  typicalVisitDuration: z.string().optional().nullable(),

  // Social Proof
  rating: z.number().optional().nullable().default(0),
  reviewCount: z.number().int().default(0),

  // Price
  entryPrice: z.any().optional().nullable(),

  // UX & Vibe
  amenities: z.array(z.string()).default([]),
  vibe: z.array(z.string()).default([]),
  accessibility: z.string().optional().nullable(),
  safetyNotes: z.string().optional().nullable(),

  // Media
  imageHeroUrl: z.string().url().optional().nullable(),
  media: z.array(z.any()).optional(),

  // CMS Content
  summary: z.string().optional().nullable(),
  highlights: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),

  // CMS flags
  autoCreated: z.boolean().default(false),
  needsReview: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Place = z.infer<typeof PlaceSchema>;

/** Update schema - all fields optional for partial updates */
export const PlaceUpdateSchema = PlaceSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type PlaceUpdate = z.infer<typeof PlaceUpdateSchema>;
