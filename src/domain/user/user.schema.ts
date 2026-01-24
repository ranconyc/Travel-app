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
} from "@/domain/common.schema";

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
  persona: z.any().nullable(), // { dailyRhythm, travelStyle, interests }
  socials: z.any().nullable(), // { instagram, tiktok }
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
  updatedAt: z.date(),
});

// --- Types ---
export type User = z.infer<typeof userSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserMedia = Media;

// --- Action / Form Schemas ---

export const saveInterestsSchema = z.object({
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
