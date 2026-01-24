import * as z from "zod";
import { mediaSchema, type Media } from "@/domain/media/media.schema";
import { UserSocialLinksSchema } from "./completeProfile.schema";
import {
  GenderEnum,
  type Gender,
  RoleEnum,
  type Role,
  type GeoPoint,
  geoPointSchema,
  type Coordinates,
} from "@/domain/common.schema";
import {
  personaSchema,
  socialsSchema,
  type UserPersona,
  type UserSocials,
} from "@/domain/persona/persona.schema";

export { GenderEnum, Gender, RoleEnum, Role, GeoPoint, geoPointSchema };

// --- Validations ---

// --- Action / Form Schemas ---

// Enums and GeoPoint moved to common.schema.ts

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
  // Use z.unknown() for Prisma JsonValue compatibility, cast at runtime
  persona: z.unknown().nullable(),
  socials: z.unknown().nullable(),
  updatedAt: z.date(),
  socialLinks: UserSocialLinksSchema.optional(),
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
  avatarUrl: z.string().url().nullable().optional(),
  passwordHash: z.string().nullable().optional(), // Optional as it's sensitive
  profileCompleted: z.boolean().default(false),

  // Location / Geo (Matches Prisma Json storage)
  currentLocation: z
    .union([geoPointSchema, z.array(z.number()), z.any()])
    .nullable(), // [lng, lat]
  currentCityId: z.string().nullable(),
  currentCity: cityLiteSchema.optional().nullable(),

  // Relations
  profile: userProfileSchema.optional().nullable(),
  media: z.array(mediaSchema).optional(),

  // Travels
  visitedCountries: z.array(z.string()).default([]),

  // Timestamps
  createdAt: z.date(),
});

// --- Types ---
export type User = z.infer<typeof userSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserMedia = Media;
export type { UserPersona, UserSocials };

/** User result from nearby search with distance */
export type NearbyUserResult = {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  birthday: Date | null;
  gender: string | null;
  occupation: string | null;
  description: string | null;
  languages: unknown;
  homeBaseCityId: string | null;
  homeBaseCity?: {
    id: string | null;
    name: string | null;
    country?: {
      id: string | null;
      name: string | null;
    } | null;
  } | null;
  distanceKm: number | null;
};

/** Extended user type with additional profile data */
export type ProfileUser = User & {
  homeBaseCity?: {
    id: string;
    name: string;
    country?: {
      id: string;
      name: string;
    } | null;
  } | null;
};

// Re-export persona schemas for runtime validation
export { personaSchema, socialsSchema };
// --- Action / Form Schemas ---

export const saveInterestsSchema = z.object({
  // Basic Info added
  firstName: z.string().optional(),
  hometown: z.string().optional(),
  avatarUrl: z.string().optional(), // Added avatarUrl

  // Interests & Persona
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  dailyRhythm: z.string().min(1, "Please select a daily rhythm"),
  travelStyle: z.string().min(1, "Please select a travel style"),
  budget: z.string().min(1, "Please select a budget"),
  currency: z.string().min(1, "Please select a currency"),
});

export type SaveInterestsFormValues = z.infer<typeof saveInterestsSchema>;

export const saveTravelSchema = z.object({
  countries: z.array(z.string()).min(1, "Please select at least one country"),
});

export type SaveTravelFormValues = z.infer<typeof saveTravelSchema>;

export const savePersonaSchema = z.object({
  areaPreferences: z.array(z.string()),
  accommodationTypes: z.array(z.string()),
  travelRhythm: z.string(),
  travelStyle: z.string(),
});

export type SavePersonaFormValues = z.infer<typeof savePersonaSchema>;

export const BioInputSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  occupation: z.string().min(1, "Occupation is required"),
  hometown: z.string().min(1, "Hometown is required"),
  birthday: z.string().min(1, "Birthday is required"),
  languages: z
    .array(
      z.object({
        code: z.string(),
        name: z.string(),
      }),
    )
    .optional(),
  gender: z.enum(["male", "female"]).optional(),
});

export type BioInput = z.infer<typeof BioInputSchema>;
