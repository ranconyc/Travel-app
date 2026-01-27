import { z } from "zod";
import {
  GenderEnum,
  languageCodeSchema,
  socialLinkSchema,
} from "@/domain/common.schema";

/**
 * Unified User Update Schema
 * Serves both Onboarding (partial) and Profile Editing (full).
 */
export const UserUpdateSchema = z.object({
  // Identity
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "Name too short")
    .optional(),
  lastName: z.string().optional(),
  avatarUrl: z.string().url().optional().nullable(),

  // Demographics
  birthday: z.string().optional().nullable(),
  gender: GenderEnum.optional().nullable(),

  // Location
  homeBaseCityId: z.string().optional().nullable(),

  // Metadata
  occupation: z.string().optional().nullable(),
  description: z.string().max(1000, "Bio too long").optional().nullable(),
  languages: z.array(languageCodeSchema).optional(),
  socials: z.array(socialLinkSchema).optional(),

  // Persona (JSON Blob)
  persona: z
    .object({
      interests: z.array(z.string()).optional(),
      dailyRhythm: z.string().optional().nullable(),
      travelStyle: z.array(z.string()).optional(),
      budget: z.string().optional().nullable(),
      currency: z.string().optional(),
    })
    .optional(),

  // Flags
  profileCompleted: z.boolean().optional(),
});

export type UserUpdateValues = z.infer<typeof UserUpdateSchema>;
