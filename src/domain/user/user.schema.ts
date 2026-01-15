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
});

/** UserMedia schema (Gallery & Profile Images) */
export const userMediaSchema = z.object({
  id: z.string(),
  userId: z.string(),
  url: z.string().url(),
  publicId: z.string(),
  isMain: z.boolean(),
  type: z.string(), // "avatar", "travel_photo", etc.
  metadata: z.record(z.any()).nullable(),
  createdAt: z.date(),
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
  persona: z.record(z.any()).nullable(), // Json field
  socials: z.record(z.any()).nullable(), // Json field
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

export const userSchema = z.object({
  // Identifiers
  id: z.string(),

  // Basic Info
  email: z.string().email().nullable(),
  role: RoleEnum.default("USER"),
  name: z.string().nullable(),
  emailVerified: z.date().nullable(),
  image: z.string().url().nullable(),
  passwordHash: z.string().nullable().optional(), // Optional as it's sensitive
  profileCompleted: z.boolean().default(false),

  // Location / Geo (Matches Prisma Json storage)
  currentLocation: z.union([z.array(z.number()), z.any()]).nullable(), // [lng, lat]
  currentCityId: z.string().nullable(),
  currentCity: cityLiteSchema.optional().nullable(),

  // Relations
  profile: userProfileSchema.optional().nullable(),
  images: z.array(userMediaSchema).optional(),
  coverImageId: z.string().nullable(),
  coverImage: userMediaSchema.optional().nullable(),

  // Travels
  trips: z.array(tripSchema).optional(),
  visitedCountries: z.array(z.string()).default([]),

  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
});

// --- Types ---
export type User = z.infer<typeof userSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserMedia = z.infer<typeof userMediaSchema>;
export type Trip = z.infer<typeof tripSchema>;
