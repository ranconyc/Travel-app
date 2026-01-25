import {
  PersonaDbModel,
  Insight,
  BUDGET_LEVELS,
  DAILY_RHYTHMS,
  TRAVEL_STYLES,
} from "./persona.schema";

export class InsightsEngine {
  private static rules: Array<(data: PersonaDbModel) => Insight | null> = [
    // Rule 1: Luxury Night Owl
    (data) => {
      const isHighBudget =
        data.budget === BUDGET_LEVELS.LUXURY ||
        data.budget === BUDGET_LEVELS.COMFORT;
      const isNightPerson = data.dailyRhythm === DAILY_RHYTHMS.NIGHT_OWL;
      const hasLuxuryInterests = data.interests.some((i) =>
        ["fine_dining", "rooftop_bars", "designer_boutiques"].includes(i),
      );

      if (isHighBudget && isNightPerson && hasLuxuryInterests) {
        return {
          code: "LUXURY_NIGHT_OWL",
          label: "Luxury Night Owl",
          category: "LUXURY",
        };
      }
      return null;
    },

    // Rule 2: Nature Explorer
    (data) => {
      const isAdventure =
        data.travelStyle === TRAVEL_STYLES.ADVENTURER ||
        data.travelStyle === TRAVEL_STYLES.EXPLORER;
      const hasNatureInterests = data.interests.some((i) =>
        [
          "national_park_hiking",
          "mountain_trekking",
          "wildlife_safaris",
          "waterfall_visits",
        ].includes(i),
      );

      if (isAdventure && hasNatureInterests) {
        return {
          code: "NATURE_EXPLORER",
          label: "Nature Explorer",
          category: "ADVENTURE",
        };
      }
      return null;
    },

    // Rule 3: Culture Vulture
    (data) => {
      const isCultural = data.travelStyle === TRAVEL_STYLES.CULTURAL;
      const hasCultureInterests = data.interests.some((i) =>
        [
          "museums",
          "historic_landmarks",
          "archaeological_sites",
          "cultural_festivals",
        ].includes(i),
      );

      if ((isCultural || data.interests.length > 3) && hasCultureInterests) {
        return {
          code: "CULTURE_VULTURE",
          label: "Culture Vulture",
          category: "CULTURE",
        };
      }
      return null;
    },

    // Rule 4: Chill Seeker
    (data) => {
      const isChill =
        data.dailyRhythm === DAILY_RHYTHMS.SPONTANEOUS ||
        data.dailyRhythm === DAILY_RHYTHMS.BALANCED;
      const hasChillInterests = data.interests.some((i) =>
        ["beach_lounging", "spa_massage", "meditation_centers"].includes(i),
      );

      if (isChill && hasChillInterests) {
        return {
          code: "CHILL_SEEKER",
          label: "Chill Seeker",
          category: "GENERAL",
        };
      }
      return null;
    },
  ];

  public static generate(data: PersonaDbModel): Insight[] {
    const insights: Insight[] = [];
    for (const rule of this.rules) {
      const result = rule(data);
      if (result) insights.push(result);
    }
    return insights;
  }
}
