import {
  UserPersona,
  PersonaFormValues,
  DailyRhythm,
  TravelStyle,
  BudgetTier,
} from "./persona.schema";
import { User } from "@/domain/user/user.schema";

/**
 * Persona Constants & Options
 */
export const AREA_OPTIONS = [
  {
    id: "convenience",
    title: "Convenience",
    subtitle: "Close to public transport",
    icon: "🚉",
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    subtitle: "Near restaurants & cafés",
    icon: "☕️",
  },
  {
    id: "entertainment",
    title: "Entertainment",
    subtitle: "Vibrant nightlife",
    icon: "🎶",
  },
  {
    id: "leisure",
    title: "Leisure",
    subtitle: "Near the beach or nature",
    icon: "🏖️",
  },
  {
    id: "shopping",
    title: "Shopping",
    subtitle: "Close to shops or markets",
    icon: "🛍️",
  },
  {
    id: "culture",
    title: "Culture",
    subtitle: "Near attractions & landmarks",
    icon: "🏛️",
  },
];

export const ACCOMMODATION_OPTIONS = [
  {
    id: "guesthouse",
    title: "Guesthouse / Homestay",
    subtitle: "",
    icon: "🏡",
  },
  { id: "hostel", title: "Hostel", subtitle: "", icon: "🛏️" },
  { id: "hotel", title: "Hotel", subtitle: "", icon: "🏨" },
  { id: "luxury", title: "Luxury", subtitle: "", icon: "⭐️" },
  {
    id: "all_inclusive",
    title: "All Inclusive Resorts",
    subtitle: "",
    icon: "🍸",
  },
  { id: "friends", title: "Friends", subtitle: "", icon: "👥" },
  { id: "longterm", title: "Longterm / Monthly", subtitle: "", icon: "📆" },
];

export const RHYTHM_OPTIONS = [
  {
    id: "early_bird",
    title: "Early Bird",
    subtitle: "Up with the sun",
    icon: "🌅",
  },
  {
    id: "balanced",
    title: "Balanced",
    subtitle: "Goes with the flow",
    icon: "⚖️",
  },
  {
    id: "night_owl",
    title: "Night Owl",
    subtitle: "Thrives at night",
    icon: "🌙",
  },
  {
    id: "spontaneous",
    title: "Spontaneous",
    subtitle: "No fixed schedule",
    icon: "💃",
  },
];

export const TRAVEL_STYLE_OPTIONS = [
  {
    id: "planner",
    title: "Planner",
    subtitle: "Detailed itineraries",
    icon: "📋",
  },
  {
    id: "explorer",
    title: "Explorer",
    subtitle: "Loose plans, open to change",
    icon: "🗺️",
  },
  {
    id: "relaxer",
    title: "Relaxer",
    subtitle: "Beach/spa focused",
    icon: "😌",
  },
  {
    id: "adventurer",
    title: "Adventurer",
    subtitle: "Extreme sports, off-beaten-path",
    icon: "🧗",
  },
  {
    id: "cultural",
    title: "Cultural",
    subtitle: "Museums, history, customs",
    icon: "🏛️",
  },
];

export interface StepConfig {
  header: string;
  description: string;
  validationFields: (keyof PersonaFormValues)[];
}

interface PersonaJson {
  identity?: {
    firstName?: string;
    hometown?: string;
    avatarUrl?: string;
  };
  preferences?: {
    dailyRhythm?: string;
    travelStyle?: string;
    budgetTier?: string;
    currency?: string;
  };
  interests?: string[];
  insights?: string[];
  areaPreferences?: string[];
  accommodationTypes?: string[];
  travelRhythm?: string;
  travelStyle?: string;
  budget?: string;
  currency?: string;
  dailyRhythm?: string;
  metadata?: {
    lastSyncedAt?: number;
    version?: number;
  };
}

/**
 * Domain Service for Persona logic.
 */
export class PersonaService {
  private readonly steps: StepConfig[] = [
    {
      header: "Let's get to know you",
      description: "Tell us a bit about yourself",
      validationFields: ["firstName", "hometown"],
    },
    {
      header: "What's your natural travel rhythm?",
      description: "Select the option that matches you the most",
      validationFields: ["dailyRhythm"],
    },
    {
      header: "Which travel style feels most like you?",
      description: "Select the option that matches you the most",
      validationFields: ["travelStyle"],
    },
    {
      header: "What's your typical travel budget?",
      description: "Select your budget level and preferred currency",
      validationFields: ["budget", "currency"],
    },
    {
      header: "What do you enjoy when traveling?",
      description: "Help us personalize your trip recommendations",
      validationFields: ["interests"],
    },
    {
      header: "Review your profile",
      description: "Make sure everything looks good",
      validationFields: [],
    },
  ];

  public getSteps() {
    return this.steps;
  }

  public getStepConfig(step: number): StepConfig {
    return this.steps[step - 1] || this.steps[0];
  }

  public getStepValidationFields(step: number): (keyof PersonaFormValues)[] {
    return this.getStepConfig(step).validationFields;
  }

  public applySkipDefaults(
    currentValues: Partial<PersonaFormValues>,
  ): PersonaFormValues {
    return {
      firstName: currentValues.firstName || "",
      hometown: currentValues.hometown || "",
      avatarUrl: currentValues.avatarUrl || "",
      interests: currentValues.interests?.length
        ? currentValues.interests
        : ["general_exploration"],
      dailyRhythm: currentValues.dailyRhythm || "balanced",
      travelStyle: Array.isArray(currentValues.travelStyle)
        ? currentValues.travelStyle
        : currentValues.travelStyle
          ? [currentValues.travelStyle as string]
          : ["explorer"],
      budget: currentValues.budget || "mid_range",
      currency: currentValues.currency || "USD",
    };
  }

  public getInitialValues(user: User | null): PersonaFormValues {
    const persona = user?.profile?.persona as PersonaJson | undefined;
    const identity = persona?.identity || {};
    const prefs = persona?.preferences || {};

    return {
      firstName: identity.firstName || user?.name || "",
      hometown: identity.hometown || user?.profile?.homeBaseCityId || "",
      avatarUrl: identity.avatarUrl || user?.avatarUrl || "",
      interests: persona?.interests || [],
      dailyRhythm: (prefs.dailyRhythm || persona?.dailyRhythm || "") as any,
      travelStyle: (prefs.travelStyle || persona?.travelStyle || []) as any,
      budget: (prefs.budgetTier || persona?.budget || "") as any,
      currency: prefs.currency || persona?.currency || "USD",
    };
  }

  public getInitialTravelPersonaValues(user: User | null) {
    const persona = user?.profile?.persona as PersonaJson | undefined;
    const prefs = persona?.preferences || {};

    return {
      areaPreferences: persona?.areaPreferences || [],
      accommodationTypes: persona?.accommodationTypes || [],
      travelRhythm:
        prefs.dailyRhythm ||
        persona?.dailyRhythm ||
        persona?.travelRhythm ||
        "",
      travelStyle: prefs.travelStyle || persona?.travelStyle || "",
    };
  }

  public toEntity(formValues: PersonaFormValues): UserPersona {
    return {
      identity: {
        firstName: formValues.firstName,
        hometown: formValues.hometown,
        avatarUrl: formValues.avatarUrl || undefined,
      },
      preferences: {
        dailyRhythm: formValues.dailyRhythm as any,
        travelStyle: formValues.travelStyle as any,
        budgetTier: formValues.budget as any,
        currency: formValues.currency,
      },
      interests: formValues.interests,
      insights: [],
      metadata: {
        lastSyncedAt: Date.now(),
        version: 1,
      },
    };
  }

  public fromUser(user: User): UserPersona {
    const profile = user?.profile;
    const persona = profile?.persona as PersonaJson | undefined;

    const identity = {
      firstName:
        persona?.identity?.firstName ||
        profile?.firstName ||
        user?.name ||
        "Traveler",
      hometown:
        persona?.identity?.hometown || profile?.homeBaseCityId || "Somewhere",
      avatarUrl: persona?.identity?.avatarUrl || user?.avatarUrl || undefined,
    };

    const preferences = {
      dailyRhythm: (persona?.preferences?.dailyRhythm ||
        persona?.dailyRhythm ||
        "balanced") as DailyRhythm,
      travelStyle: (persona?.preferences?.travelStyle ||
        persona?.travelStyle ||
        "explorer") as TravelStyle,
      budgetTier: (persona?.preferences?.budgetTier ||
        persona?.budget ||
        "mid_range") as BudgetTier,
      currency: persona?.preferences?.currency || persona?.currency || "USD",
    };

    return {
      identity,
      preferences,
      interests: persona?.interests || [],
      insights: (persona?.insights || []) as any,
      metadata: {
        lastSyncedAt: persona?.metadata?.lastSyncedAt || Date.now(),
        version: persona?.metadata?.version || 1,
      },
    };
  }

  public getOptions() {
    return {
      areas: AREA_OPTIONS,
      accommodations: ACCOMMODATION_OPTIONS,
      rhythms: RHYTHM_OPTIONS,
      styles: TRAVEL_STYLE_OPTIONS,
    };
  }
}

export const personaService = new PersonaService();
