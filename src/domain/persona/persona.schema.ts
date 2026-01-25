import { z } from "zod";

// --- Constants (Restored for Legacy Compatibility) ---
export const DAILY_RHYTHMS = ["Early Bird", "Night Owl", "Flexible"] as const;
export const TRAVEL_STYLES = [
  "Backpacking",
  "Luxury",
  "Budget",
  "Standard", // Added to ensure coverage
] as const;
export const BUDGET_LEVELS = ["Low", "Medium", "High"] as const;

export type DailyRhythm = (typeof DAILY_RHYTHMS)[number];
export type TravelStyle = (typeof TRAVEL_STYLES)[number];
export type BudgetLevel = (typeof BUDGET_LEVELS)[number];

// Placeholder for legacy PersonaDbModel if needed
export type PersonaDbModel = z.infer<typeof TravelPersonaSchema>;
export type PersonaFormValues = z.infer<typeof TravelPersonaSchema>;

// Zod Schema for Travel Persona
export const TravelPersonaSchema = z.object({
  // Rhythm Step
  dailyRhythm: z
    .enum(["Early Bird", "Night Owl", "Flexible"])
    .nullable()
    .optional(),

  // Style Step
  travelStyle: z.array(z.string()).default([]), // ["Backpacking", "Luxury", "Budget", etc.]
  planningStyle: z
    .enum(["Structured", "Spontaneous", "Balanced"])
    .nullable()
    .optional(),

  // Interests/Summary
  interests: z.array(z.string()).default([]), // ["Hiking", "Museums", "Food", etc.]

  // Additional (Optional)
  bio: z.string().optional(),
});

// TypeScript Type inferred from Zod Schema
export type TravelPersona = z.infer<typeof TravelPersonaSchema>;

// Default / Initial State
export const defaultTravelPersona: TravelPersona = {
  dailyRhythm: null,
  travelStyle: [],
  planningStyle: null,
  interests: [],
};

// --- Legacy / Backwards Compatibility ---
// Exposing these to satisfy user.schema.ts imports until fully refactored
export const personaSchema = TravelPersonaSchema; // Alias for now
export type UserPersona = TravelPersona; // Alias for now

// Placeholder for socials if it was removed, or if it needs to be defined
export const socialsSchema = z.object({
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
});
export type UserSocials = z.infer<typeof socialsSchema>;

export const personaFormSchema = TravelPersonaSchema; // Alias for form usage
