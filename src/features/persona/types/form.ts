import { z } from "zod";
import {
  DailyRhythmEnum,
  TravelStyleEnum,
  BudgetTierEnum,
  InterestCategoryEnum,
} from "@/domain/persona/persona.schema";

/**
 * Persona Form Schema
 *
 * This extends the base persona fields with form-specific validation
 * (e.g., required fields for the form flow vs optional in the entity)
 */
export const formSchema = z.object({
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

export type PersonaFormValues = z.infer<typeof formSchema>;

export type TravelPersonaFormValues = {
  areaPreferences: string[];
  accommodationTypes: string[];
  travelRhythm: string;
  travelStyle: string;
};

// Re-export enums for use in form steps
export {
  DailyRhythmEnum,
  TravelStyleEnum,
  BudgetTierEnum,
  InterestCategoryEnum,
};
