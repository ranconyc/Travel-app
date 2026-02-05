import {
  calculateMatchScore,
  MatchScoreResult,
  PlaceForMatching,
  UserPersonaForMatching,
} from "./matching.service";

// Moved from MoodSelector to decouple logic
export type Mood = "hungry" | "work" | "social" | "chill" | null;

const MOODS_INTERESTS: Record<string, string[]> = {
  hungry: [
    "street_food_markets",
    "fine_dining",
    "cooking_classes",
    "wine_brewery_tours",
    "rooftop_bars",
    "nightclubs_dancing",
    "live_music_venues",
  ],
  work: ["coworking_spaces", "work_friendly_cafes", "meetup_events"],
  social: [
    "nightclubs_dancing",
    "rooftop_bars",
    "live_music_venues",
    "meetup_events",
    "hostel_vibes",
  ],
  chill: [
    "yoga_meditation",
    "spa_wellness_centers",
    "hot_springs",
    "beach_lounging",
    "silent_retreats",
  ],
};

export function getMoodRelatedInterests(mood: Mood): string[] {
  if (!mood) return [];
  return MOODS_INTERESTS[mood] || [];
}

/**
 * Enhanced matching service with mood-based filtering
 */
export interface EnhancedMatchResult extends MatchScoreResult {
  originalScore: number;
  moodBoost: number;
  finalScore: number;
}

export interface UserPersonaEnhanced extends UserPersonaForMatching {
  mood?: Mood;
}

/**
 * Calculate enhanced match score with mood-based weight boost
 *
 * Logic: If a Mood is active, give a 2x weight boost to interest IDs related to that mood
 */
export function calculateEnhancedMatchScore(
  userPersona: UserPersonaEnhanced,
  place: PlaceForMatching,
): EnhancedMatchResult {
  // Get base match score
  const baseResult = calculateMatchScore(userPersona, place);

  // Calculate mood boost
  let moodBoost = 0;
  const moodRelatedInterests = userPersona.mood
    ? getMoodRelatedInterests(userPersona.mood)
    : [];

  if (userPersona.mood && moodRelatedInterests.length > 0) {
    // Check if place has mood-related interests
    const matchingMoodInterests = place.tags.filter((tag) =>
      moodRelatedInterests.includes(tag),
    );

    if (matchingMoodInterests.length > 0) {
      // Calculate boost: 2x weight for matching mood interests
      const moodInterestRatio =
        matchingMoodInterests.length / moodRelatedInterests.length;
      moodBoost = Math.round(moodInterestRatio * 50); // Max 50 point boost

      // Add reasoning for mood boost
      baseResult.reasoning.push(
        `Mood boost: +${moodBoost} points for ${userPersona.mood} mood match`,
      );
    }
  }

  // Calculate final score
  const finalScore = Math.min(100, baseResult.score + moodBoost);

  return {
    ...baseResult,
    originalScore: baseResult.score,
    moodBoost,
    finalScore,
  };
}

/**
 * Filter and sort places based on enhanced matching
 */
export function filterAndSortPlaces<TPlace extends PlaceForMatching>(
  places: TPlace[],
  userPersona: UserPersonaEnhanced,
  options: {
    maxDistance?: number; // in km
    minScore?: number;
    limit?: number;
  } = {},
): Array<{ place: TPlace; matchResult: EnhancedMatchResult }> {
  const { maxDistance, minScore = 0, limit = 50 } = options;
  void maxDistance;

  const placesWithScores = places.map((place) => ({
    place,
    matchResult: calculateEnhancedMatchScore(userPersona, place),
  }));

  const filtered = placesWithScores.filter(
    ({ matchResult }) => matchResult.finalScore >= minScore,
  );

  const sorted = filtered.sort(
    (a, b) => b.matchResult.finalScore - a.matchResult.finalScore,
  );

  return sorted.slice(0, limit);
}

export function getPlacesByMood<TPlace extends PlaceForMatching>(
  places: TPlace[],
  mood: Mood,
  userPersona: UserPersonaForMatching,
  limit: number = 20,
): Array<{ place: TPlace; matchResult: EnhancedMatchResult }> {
  const enhancedPersona: UserPersonaEnhanced = {
    ...userPersona,
    mood,
  };

  return filterAndSortPlaces(places, enhancedPersona, { limit });
}

/**
 * Calculate distance between two coordinates
 */
export function calculateDistance(
  coords1: { type: string; coordinates: [number, number] },
  coords2: { type: string; coordinates: [number, number] },
): number {
  const [lng1, lat1] = coords1.coordinates;
  const [lng2, lat2] = coords2.coordinates;

  // Haversine formula
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
