import { User } from "../user/user.schema";
import { MatchResult } from "./match.schema";

/**
 * PURE LOGIC FUNCTION
 * No DB calls here. Pass the user objects directly.
 * Perfect for mapping over a list of users in a search result.
 */
export function calculateMatchScoreBatch(
  currentUser: User,
  targetUser: User,
  mode: "current" | "travel" = "current",
): MatchResult {
  const isTravelMode = mode === "current";

  // --- INITIALIZE AT 70 (The "Optimistic" Base) ---
  // Starting at 70 makes the app feel friendly.
  // Good matches go up to 100, bad ones drop below 40.
  let finalScore = 70;

  const result: MatchResult = {
    score: 0,
    breakdown: {
      languages: { score: 0, distinct: [], shared: [] },
      places: { score: 0, distinct: 0, shared: [] },
      interests: { score: 0, distinct: [], shared: [] },
      location: {
        score: 0,
        sameCity: currentUser?.currentCityId === targetUser?.currentCityId,
        sameCountry:
          (currentUser?.currentCity?.countryRefId ?? "current") ===
          (targetUser?.currentCity?.countryRefId ?? "target"),
        city: targetUser?.currentCity?.name,
        country: targetUser?.currentCity?.country?.name,
      },
      age: { score: 0, isWithinRange: false, diffYears: 0 },
      friends: { score: 0, count: 0, mutualNames: [] },
      futurePlans: { score: 0, count: 0, sharedDestinations: [] },
      travelStyle: { score: 0, styles: [], shared: [] },
      proximity: { score: 0, distanceKm: null },
    },
  };

  // --- 1. TRAVEL STYLE (The "Friction" check) ---
  const getStyle = (u: User) => (u?.profile?.persona as any)?.travelStyle;
  const s1 = getStyle(currentUser);
  const s2 = getStyle(targetUser);

  if (s1 && s2) {
    if (s1 === s2) {
      finalScore += 10; // Bonus for same vibe
      result.breakdown.travelStyle.score = 10;
      result.breakdown.travelStyle.shared = [s1];
    } else {
      // SUBTRACT if they are incompatible (e.g., Luxury vs Budget)
      const isClash =
        (s1 === "Luxury" && s2 === "Backpacker") ||
        (s1 === "Backpacker" && s2 === "Luxury");
      if (isClash) {
        finalScore -= 20;
        result.breakdown.travelStyle.score = -20;
      }
    }
  }

  // --- 2. LANGUAGES (The "Communication" check) ---
  const currentLangs = currentUser?.profile?.languages || [];
  const targetLangs = targetUser?.profile?.languages || [];
  const sharedLangs = currentLangs.filter((l: string) =>
    targetLangs.includes(l),
  );

  if (sharedLangs.length === 0) {
    finalScore -= 25; // Massive friction if they can't talk
    result.breakdown.languages.score = -25;
  } else {
    const bonus = Math.min(sharedLangs.length * 5, 15);
    finalScore += bonus;
    result.breakdown.languages.score = bonus;
    result.breakdown.languages.shared = sharedLangs;
  }

  // --- 3. INTERESTS (Standard additive) ---
  const currentInterests =
    (currentUser?.profile?.persona as any)?.interests || [];
  const targetInterests =
    (targetUser?.profile?.persona as any)?.interests || [];

  const sharedInterests = currentInterests.filter((i: string) =>
    targetInterests.includes(i),
  );

  if (sharedInterests.length > 0) {
    const points = Math.min(sharedInterests.length * 5, 20);
    finalScore += points;
    result.breakdown.interests.score = points;
    result.breakdown.interests.shared = sharedInterests;
  } else {
    finalScore -= 10; // Points off if zero common ground
  }

  // --- 4. AGE GAP ---
  if (currentUser?.profile?.birthday && targetUser?.profile?.birthday) {
    const diff = Math.abs(
      getAge(currentUser?.profile?.birthday) -
        getAge(targetUser?.profile?.birthday),
    );
    result.breakdown.age.diffYears = diff;
    if (diff > 15) {
      finalScore -= 15; // Usually different life stages
      result.breakdown.age.score = -15;
    } else if (diff <= 3) {
      finalScore += 5;
      result.breakdown.age.score = 5;
    }
  }

  // --- 5. LOCATION & PROXIMITY ---
  if (result.breakdown.location.sameCity) {
    finalScore += 5;
  } else if (!result.breakdown.location.sameCountry) {
    finalScore -= 10; // Harder to meet if in different countries
  }

  // Final Clamp
  result.score = Math.max(0, Math.min(Math.round(finalScore), 100));

  return result;
}

// Helpers retained for the logic
function getAge(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
}
