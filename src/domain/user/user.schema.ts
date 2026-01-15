import * as z from "zod";

// --- Enums ---
export const GenderEnum = z.enum(["MALE", "FEMALE", "NON_BINARY"]);
export type Gender = z.infer<typeof GenderEnum>;

export const RoleEnum = z.enum(["USER", "ADMIN"]);
export type Role = z.infer<typeof RoleEnum>;

export const TripTypeEnum = z.enum(["VISITED", "WISHLIST", "PLANNED"]);
export const TripStatusEnum = z.enum([
  "DRAFT",
  "ACTIVE",
  "COMPLETED",
  "PUBLISHED",
]);

// --- Helper / Nested Schemas ---

/** Simplified City schema for relations */
export const cityLiteSchema = z.object({
  id: z.string(),
  cityId: z.string(),
  name: z.string(),
  countryRefId: z.string().nullable(),
  imageHeroUrl: z.string().url().nullable(),
  country: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional()
    .nullable(),
});

/** UserProfile schema (Identity & Bio) */
export const userProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  occupation: z.string().nullable(),
  birthday: z.date().nullable(),
  description: z.string().nullable(),
  gender: GenderEnum.nullable(),
  languages: z.array(z.string()).default([]),
  homeBaseCityId: z.string().nullable(),
  homeBaseCity: cityLiteSchema.optional().nullable(),
  persona: z.any().nullable(), // { dailyRhythm, travelStyle, interests }
  socials: z.any().nullable(), // { instagram, tiktok }
  updatedAt: z.date(),
});

/** Trip schema */
export const tripSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: TripTypeEnum,
  status: TripStatusEnum,
  name: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  createdAt: z.date(),
});

// --- Main User Schema ---

/** Partial Trip schema for shallow relations */
export const partialTripSchema = z.object({
  id: z.string(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
});

export const userSchema = z.object({
  // Identifiers
  id: z.string(),

  // Basic Info
  email: z.string().email().nullable(),
  role: RoleEnum.default("USER"),
  name: z.string().nullable(),
  emailVerified: z.date().nullable(),
  avatarUrl: z.string().url().nullable().optional(),
  passwordHash: z.string().nullable().optional(), // Optional as it's sensitive
  profileCompleted: z.boolean().default(false),

  // Location / Geo (Matches Prisma Json storage)
  currentLocation: z.union([z.array(z.number()), z.any()]).nullable(), // [lng, lat]
  currentCityId: z.string().nullable(),
  currentCity: cityLiteSchema.optional().nullable(),

  // Relations
  profile: userProfileSchema.optional().nullable(),
  media: z.array(z.any()).optional(), // Will be Media type from external schema

  // Travels
  trips: z.array(z.union([tripSchema, partialTripSchema])).optional(),
  visitedCountries: z.array(z.string()).default([]),

  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
});

// --- Types ---
export type User = z.infer<typeof userSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserMedia = any;
export type Trip = z.infer<typeof tripSchema>;
