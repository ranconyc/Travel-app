import { z } from "zod";

// --- Constants (Restored for Legacy Compatibility) ---
export const DAILY_RHYTHMS = {
  EARLY_BIRD: "Early Bird",
  NIGHT_OWL: "Night Owl",
  FLEXIBLE: "Flexible",
  SPONTANEOUS: "Spontaneous", // Added to satisfy insights
  BALANCED: "Balanced", // Added to satisfy insights
} as const;

export const TRAVEL_STYLES = {
  BACKPACKING: "Backpacking",
  LUXURY: "Luxury",
  BUDGET: "Budget",
  STANDARD: "Standard",
  ADVENTURER: "Adventurer",
  EXPLORER: "Explorer",
  CULTURAL: "Cultural",
  PLANNER: "Planner", // For consistency
  RELAXER: "Relaxer", // For consistency
} as const;

export const BUDGET_LEVELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  LUXURY: "Luxury",
  COMFORT: "Comfort",
  MID_RANGE: "Mid-Range",
  BUDGET: "Budget",
  BACKPACKER: "Backpacker",
} as const;

export type DailyRhythm = (typeof DAILY_RHYTHMS)[keyof typeof DAILY_RHYTHMS];
export type TravelStyle = (typeof TRAVEL_STYLES)[keyof typeof TRAVEL_STYLES];
export type BudgetLevel = (typeof BUDGET_LEVELS)[keyof typeof BUDGET_LEVELS];
export type BudgetTier = BudgetLevel;

// Placeholder for legacy PersonaDbModel if needed
export type PersonaDbModel = z.infer<typeof TravelPersonaSchema> & {
  budget?: string;
  currency?: string;
};
export type PersonaFormValues = z.infer<typeof TravelPersonaSchema> & {
  firstName: string;
  hometown: string;
  avatarUrl?: string;
};

export type Insight = {
  code: string;
  label: string;
  category: string;
};

// Zod Schema for Travel Persona
export const TravelPersonaSchema = z.object({
  // Rhythm Step
  dailyRhythm: z
    .enum([
      "Early Bird",
      "Night Owl",
      "Flexible",
      "balanced",
      "spontaneous",
      "Balanced",
      "Spontaneous",
    ])
    .nullable()
    .optional(),

  // Style Step
  travelStyle: z.array(z.string()), // ["Backpacking", "Luxury", "Budget", etc.]
  planningStyle: z
    .enum(["Structured", "Spontaneous", "Balanced", "spontaneous", "balanced"])
    .nullable()
    .optional(),

  // Interests/Summary
  interests: z.array(z.string()), // ["Hiking", "Museums", "Food", etc.]

  // Budget
  budget: z.string().nullable(),
  currency: z.string(),

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
  budget: null,
  currency: "USD",
};

// --- Legacy / Backwards Compatibility ---
// Exposing these to satisfy user.schema.ts imports until fully refactored
export const personaSchema = TravelPersonaSchema; // Alias for now
export type UserPersona = {
  identity: {
    firstName: string;
    hometown: string;
    avatarUrl?: string;
  };
  preferences: {
    dailyRhythm: DailyRhythm;
    travelStyle: TravelStyle;
    budgetTier: BudgetTier;
    currency: string;
  };
  interests: string[];
  insights: Insight[];
  metadata: {
    lastSyncedAt: number;
    version: number;
  };
};

// Placeholder for socials if it was removed, or if it needs to be defined
export const socialsSchema = z.object({
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
});
export type UserSocials = z.infer<typeof socialsSchema>;

export const personaFormSchema = TravelPersonaSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  hometown: z.string().min(1, "Hometown is required"),
  avatarUrl: z.string().url().optional(),
});
