import {
  DailyRhythm,
  DAILY_RHYTHMS,
  TravelStyle,
  TRAVEL_STYLES,
  BudgetLevel,
  BUDGET_LEVELS,
  PersonaDbModel,
} from "@/features/persona/types/domain";
import { PersonaFormValues } from "@/features/persona/types/form";

/**
 * Maps Rhythm ID from UI to DB.
 * Since UI now uses standardized IDs, this is primarily a pass-through with validation.
 */
export const mapRhythmToDb = (id: string): DailyRhythm | string => {
  const values = Object.values(DAILY_RHYTHMS) as string[];
  if (values.includes(id)) {
    return id as DailyRhythm;
  }
  return id;
};

/**
 * Maps Style ID from UI to DB.
 */
export const mapStyleToDb = (id: string): TravelStyle | string => {
  const values = Object.values(TRAVEL_STYLES) as string[];
  if (values.includes(id)) {
    return id as TravelStyle;
  }
  return id;
};

/**
 * Maps Budget ID from UI to DB.
 */
export const mapBudgetToDb = (id: string): BudgetLevel | string => {
  const values = Object.values(BUDGET_LEVELS) as string[];
  if (values.includes(id)) {
    return id as BudgetLevel;
  }

  // Legacy support for labels or symbols
  const upper = id.toUpperCase();
  if (upper.includes("LUXURY") || upper === "$$$$") return BUDGET_LEVELS.LUXURY;
  if (upper.includes("COMFORT") || upper === "$$$")
    return BUDGET_LEVELS.COMFORT;
  if (upper.includes("MID") || upper === "$$") return BUDGET_LEVELS.MID_RANGE;
  if (upper.includes("BUDGET")) return BUDGET_LEVELS.BUDGET;
  if (upper.includes("BACKPACKER") || upper === "$")
    return BUDGET_LEVELS.BACKPACKER;

  return id;
};

export const mapUiToDb = (formValues: PersonaFormValues): PersonaDbModel => {
  return {
    dailyRhythm: mapRhythmToDb(formValues.dailyRhythm),
    travelStyle: mapStyleToDb(formValues.travelStyle),
    budget: mapBudgetToDb(formValues.budget),
    currency: formValues.currency,
    interests: formValues.interests,
  };
};

export const mapDbToUi = (
  dbModel: Partial<PersonaDbModel>,
): Partial<PersonaFormValues> => {
  return {
    dailyRhythm: dbModel.dailyRhythm as string,
    travelStyle: dbModel.travelStyle as string,
    budget: dbModel.budget as string,
    currency: dbModel.currency,
    interests: dbModel.interests,
  };
};
