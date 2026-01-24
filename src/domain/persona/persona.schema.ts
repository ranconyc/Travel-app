import { z } from "zod";

// ============================================
// PERSONA ENUMS
// ============================================

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
export type DailyRhythm = z.infer<typeof DailyRhythmEnum>;
export type TravelStyle = z.infer<typeof TravelStyleEnum>;
export type BudgetTier = z.infer<typeof BudgetTierEnum>;
export type InterestCategory = z.infer<typeof InterestCategoryEnum>;

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
