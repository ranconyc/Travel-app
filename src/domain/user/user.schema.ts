import * as z from "zod";

export const Gender = z.enum(["MALE", "FEMALE", "NON_BINARY"]);

/** Optional GeoJSON-like point for currentLocation */
export const UserLocationSchema = z
  .object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
  })
  .optional();

/** Language item as used in your UI (based on languages.json) */
export const UserLanguageSchema = z.object({
  code: z.string(),
  name: z.string(),
  nativeName: z.string().optional(),
  flag: z.string().optional(),
  label: z.string().optional(),
});

/** User Schema (aligned with Prisma `User` + your UI needs) */
export const userSchema = z.object({
  // Identity
  id: z.string().optional(),

  // Auth / contact
  email: z.string().email().optional(),
  emailVerified: z.date().optional(),
  passwordHash: z.string().optional(),

  // Names
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),

  // Home base (relation to City)
  homeBaseCityId: z.string().optional(),
  // Optional denormalized label you might use in forms
  homeBaseLabel: z.string().optional(),

  // Profile info
  occupation: z.string().optional(),
  birthday: z.date().optional(),
  description: z.string().optional(),
  gender: Gender.optional(),
  image: z.string().url().optional(),

  profileCompleted: z.boolean().default(false),

  // Language many-to-many (via join table in Prisma)
  languages: z.array(UserLanguageSchema).default([]),

  // Destinations
  currentLocation: UserLocationSchema,
  currentCityId: z.string().optional(),

  // Relations (kept loose – can be refined later)
  accounts: z.array(z.unknown()).optional(),
  sessions: z.array(z.unknown()).optional(),
  interests: z.array(z.unknown()).optional(),
  travelPersona: z.unknown().optional(),
  visitedCities: z.array(z.unknown()).optional(),
  wishListCities: z.array(z.unknown()).optional(),

  // Timestamps
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type User = z.infer<typeof userSchema>;
export type Language = z.infer<typeof UserLanguageSchema>;
export type GenderType = z.infer<typeof Gender>;
