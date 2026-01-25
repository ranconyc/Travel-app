import { z } from "zod";

// ============================================
// DOMAIN ENUMS & CONSTANTS
// ============================================

export const DAILY_RHYTHMS = {
  EARLY_BIRD: "early_bird",
  BALANCED: "balanced",
  NIGHT_OWL: "night_owl",
  SPONTANEOUS: "spontaneous",
} as const;

export const TRAVEL_STYLES = {
  PLANNER: "planner",
  EXPLORER: "explorer",
  RELAXER: "relaxer",
  ADVENTURER: "adventurer",
  CULTURAL: "cultural",
} as const;

export const BUDGET_LEVELS = {
  BACKPACKER: "backpacker",
  BUDGET: "budget",
  MID_RANGE: "mid_range",
  COMFORT: "comfort",
  LUXURY: "luxury",
} as const;

export type DailyRhythm = (typeof DAILY_RHYTHMS)[keyof typeof DAILY_RHYTHMS];
export type TravelStyle = (typeof TRAVEL_STYLES)[keyof typeof TRAVEL_STYLES];
export type BudgetTier = (typeof BUDGET_LEVELS)[keyof typeof BUDGET_LEVELS];
export type BudgetLevel = BudgetTier;

export const DailyRhythmEnum = z.enum([
  "early_bird",
  "balanced",
  "night_owl",
  "spontaneous",
]);

export const TravelStyleEnum = z.enum([
  "planner",
  "explorer",
  "relaxer",
  "adventurer",
  "cultural",
]);

export const BudgetTierEnum = z.enum([
  "backpacker",
  "budget",
  "mid_range",
  "comfort",
  "luxury",
]);

export const InterestCategoryEnum = z.enum([
  "food_tours",
  "street_food",
  "fine_dining",
  "cooking_classes",
  "wine_beer",
  "hiking",
  "water_sports",
  "extreme_sports",
  "wildlife",
  "museums",
  "architecture",
  "history",
  "local_festivals",
  "religious_sites",
  "nightlife",
  "shopping",
  "wellness_spa",
  "photography",
  "solo_travel",
  "group_activities",
  "local_meetups",
  "general_exploration",
]);

// ============================================
// DOMAIN MODELS
// ============================================

export interface Insight {
  code: string;
  label: string;
  category: "LUXURY" | "ADVENTURE" | "CULTURE" | "GENERAL" | "RHYTHM";
  score?: number;
}

export interface PersonaDbModel {
  dailyRhythm: DailyRhythm | string;
  travelStyle: TravelStyle | string;
  budget: BudgetLevel | string;
  currency: string;
  interests: string[];
  insights?: string[]; // Array of insight codes
}

export type InterestCategory = z.infer<typeof InterestCategoryEnum>;

// ============================================
// CORE PERSONA SCHEMA (Immutable Structure)
// ============================================

/**
 * Shared UserPersona Entity - Single Source of Truth
 * Exactly matches the structure defined in Section 5 of the Architecture Audit.
 */
export const personaSchema = z.object({
  identity: z.object({
    firstName: z.string().min(2),
    hometown: z.string().min(2),
    avatarUrl: z.string().url().optional(),
  }),
  preferences: z.object({
    dailyRhythm: DailyRhythmEnum,
    travelStyle: TravelStyleEnum,
    budgetTier: BudgetTierEnum,
    currency: z.string().default("USD"),
  }),
  interests: z.array(z.string()).default([]), // IDs mapping to interests.json
  insights: z.array(z.string()).default([]), // Derived codes from InsightsEngine
  metadata: z.object({
    lastSyncedAt: z.number(), // timestamp
    version: z.number().default(1),
  }),
});

export type UserPersona = z.infer<typeof personaSchema>;

// ============================================
// FORM SCHEMAS (Persona Creation Flow)
// ============================================

/**
 * Persona Form Schema
 * This extends the base persona fields with form-specific validation
 */
export const personaFormSchema = z.object({
  // Basic Info (required in form flow)
  firstName: z.string().min(1, "First name is required"),
  hometown: z.string().min(1, "Home city is required"),
  avatarUrl: z.string().optional(),

  // Persona (required in form flow, optional in entity)
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  dailyRhythm: z.string().min(1, "Please select a daily rhythm"),
  travelStyle: z.string().min(1, "Please select a travel style"),
  budget: z.string().min(1, "Please select a budget"),
  currency: z.string().min(1, "Please select a currency"),
});

export type PersonaFormValues = z.infer<typeof personaFormSchema>;

export type TravelPersonaFormValues = {
  areaPreferences: string[];
  accommodationTypes: string[];
  travelRhythm: string;
  travelStyle: string;
};

// ============================================
// SOCIALS SCHEMA
// ============================================

export const socialsSchema = z
  .object({
    instagram: z.string().optional().nullable(),
    tiktok: z.string().optional().nullable(),
    twitter: z.string().optional().nullable(),
    linkedin: z.string().optional().nullable(),
  })
  .optional()
  .nullable();

export type UserSocials = z.infer<typeof socialsSchema>;
