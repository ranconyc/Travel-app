import { PersonaFormValues } from "@/features/persona/types/form";
import { PersonaDbModel } from "@/features/persona/types/domain";
import { InsightsEngine } from "@/features/persona/logic/insights.engine";
import { UserPersona } from "./persona.schema";

/**
 * Persona Constants & Options
 * Centralized here to prevent "Enterprise Drift" in UI components.
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

/**
 * Domain Service for Persona logic.
 * Centralizes all business rules related to user onboarding and travel styles.
 */
export class PersonaService {
  /**
   * Applies default values when a user skips high-friction onboarding steps.
   */
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
      travelStyle: currentValues.travelStyle || "explorer",
      budget: currentValues.budget || "mid_range",
      currency: currentValues.currency || "USD",
    };
  }

  /**
   * Initializes form values from the nested UserPersona entity or legacy store.
   */
  public getInitialValues(user: any): PersonaFormValues {
    const persona = (user?.profile?.persona || {}) as any;
    const identity = persona.identity || {};
    const prefs = persona.preferences || {};

    return {
      firstName: identity.firstName || user?.name || "",
      hometown: identity.hometown || user?.profile?.homeBaseCityId || "",
      avatarUrl: identity.avatarUrl || user?.avatarUrl || "",
      interests: persona.interests || [],
      dailyRhythm: prefs.dailyRhythm || persona.dailyRhythm || "",
      travelStyle: prefs.travelStyle || persona.travelStyle || "",
      budget: prefs.budgetTier || persona.budget || "",
      currency: prefs.currency || persona.currency || "USD",
    };
  }

  /**
   * Specifically for the detailed TravelPersona flow.
   */
  public getInitialTravelPersonaValues(user: any) {
    const persona = (user?.profile?.persona || {}) as any;
    const prefs = persona.preferences || {};

    return {
      areaPreferences: persona.areaPreferences || [],
      accommodationTypes: persona.accommodationTypes || [],
      travelRhythm:
        prefs.dailyRhythm || persona.dailyRhythm || persona.travelRhythm || "",
      travelStyle: prefs.travelStyle || persona.travelStyle || "",
    };
  }

  /**
   * Maps form values to the finalized UserPersona entity structure.
   */
  public toEntity(formValues: PersonaFormValues): UserPersona {
    return {
      identity: {
        firstName: formValues.firstName,
        hometown: formValues.hometown,
        avatarUrl: formValues.avatarUrl,
      },
      preferences: {
        dailyRhythm: formValues.dailyRhythm as any,
        travelStyle: formValues.travelStyle as any,
        budgetTier: formValues.budget as any,
        currency: formValues.currency,
      },
      interests: formValues.interests,
      insights: [], // Derived code logic elsewhere
      metadata: {
        lastSyncedAt: Date.now(),
        version: 1,
      },
    };
  }

  /**
   * Maps a raw User object from the DB to the immutable UserPersona entity for display.
   */
  public fromUser(user: any): UserPersona {
    const profile = user?.profile || {};
    const persona = (profile.persona || {}) as any;

    // Identity mapping (prefers profile fields, falls back to User root)
    const identity = {
      firstName:
        persona.identity?.firstName ||
        profile.firstName ||
        user?.name ||
        "Traveler",
      hometown:
        persona.identity?.hometown || profile.homeBaseCityId || "Somewhere",
      avatarUrl: persona.identity?.avatarUrl || user?.avatarUrl,
    };

    // Preferences mapping (handles legacy flattened structure)
    const preferences = {
      dailyRhythm: (persona.preferences?.dailyRhythm ||
        persona.dailyRhythm ||
        "balanced") as any,
      travelStyle: (persona.preferences?.travelStyle ||
        persona.travelStyle ||
        "explorer") as any,
      budgetTier: (persona.preferences?.budgetTier ||
        persona.budget ||
        "mid_range") as any,
      currency: persona.preferences?.currency || persona.currency || "USD",
    };

    return {
      identity,
      preferences,
      interests: persona.interests || [],
      insights: persona.insights || [],
      metadata: {
        lastSyncedAt: persona.metadata?.lastSyncedAt || Date.now(),
        version: persona.metadata?.version || 1,
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
