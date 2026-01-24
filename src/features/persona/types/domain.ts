export type OnboardingStep =
  | "BASIC"
  | "RHYTHM"
  | "STYLE"
  | "BUDGET"
  | "INTERESTS"
  | "SUMMARY";

export const DAILY_RHYTHMS = {
  EARLY_BIRD: "early_bird",
  BALANCED: "balanced",
  NIGHT_OWL: "night_owl",
  SPONTANEOUS: "spontaneous",
} as const;

export type DailyRhythm = (typeof DAILY_RHYTHMS)[keyof typeof DAILY_RHYTHMS];

export const TRAVEL_STYLES = {
  PLANNER: "planner",
  EXPLORER: "explorer",
  RELAXER: "relaxer",
  ADVENTURER: "adventurer",
  CULTURAL: "cultural",
} as const;

export type TravelStyle = (typeof TRAVEL_STYLES)[keyof typeof TRAVEL_STYLES];

export const BUDGET_LEVELS = {
  BACKPACKER: "backpacker",
  BUDGET: "budget",
  MID_RANGE: "mid_range",
  COMFORT: "comfort",
  LUXURY: "luxury",
} as const;

export type BudgetLevel = (typeof BUDGET_LEVELS)[keyof typeof BUDGET_LEVELS];

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

export interface PersonaMapper<UiType, DbType> {
  toDb(val: UiType): DbType;
  toUi(val: DbType): UiType;
}
