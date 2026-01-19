import { getUsersForMatching } from "@/lib/db/user.repo";
import { MatchResult } from "./match.schema";

// Helper to calculate age from birth date
function getAge(date: Date) {
  const diff = Date.now() - date.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// Helper for distance (Haversine)
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export async function calculateMatchScore(
  currentUserId: string,
  targetUserId: string,
  mode: "current" | "travel" = "current",
): Promise<MatchResult> {
  const users = await getUsersForMatching([currentUserId, targetUserId]);

  const currentUser = users.find((u) => u.id === currentUserId);
  const targetUser = users.find((u) => u.id === targetUserId);

  if (!currentUser || !targetUser) {
    throw new Error("One or both users not found");
  }

  // Init outcome with new fields
  const result: MatchResult = {
    score: 0,
    breakdown: {
      languages: { score: 0, distinct: [], shared: [] },
      places: { score: 0, distinct: 0, shared: [] },
      interests: { score: 0, distinct: [], shared: [] },
      location: {
        score: 0,
        sameCity: false,
        sameCountry: false,
        city: targetUser.currentCity?.name,
        country: targetUser.currentCity?.country?.name,
      },
      age: { score: 0, isWithinRange: false, diffYears: 0 },
      friends: { score: 0, count: 0, mutualNames: [] },
      futurePlans: { score: 0, count: 0, sharedDestinations: [] },
      travelStyle: { score: 0, styles: [], shared: [] },
      proximity: { score: 0, distanceKm: null },
    },
  };

  const isTravelMode = mode === "travel";

  // --- 1. Languages (Standard: 15%) ---
  const currentLangs = currentUser.profile?.languages || [];
  const targetLangs = targetUser.profile?.languages || [];
  const sharedLangs = currentLangs.filter((l) => targetLangs.includes(l));
  {
    // Max 15 pts
    const points = Math.min(sharedLangs.length * 7.5, 15);
    result.breakdown.languages = {
      score: points,
      distinct: targetLangs,
      shared: sharedLangs,
    };
  }

  // --- 2. Visited Places (Standard: 20%, Travel: 15%) ---
  const currentVisited = currentUser.visitedCountries || [];
  const targetVisited = targetUser.visitedCountries || [];
  const sharedDeep = currentVisited.filter((c) => targetVisited.includes(c));
  {
    const maxScore = isTravelMode ? 15 : 20;
    // Scale: 5 pts per country?
    const points = Math.min(sharedDeep.length * 5, maxScore);
    result.breakdown.places = {
      score: points,
      distinct: targetVisited.length,
      shared: sharedDeep,
    };
  }

  // --- 3. Interests (Standard: 18%, Travel: 15%) ---
  const getInterests = (u: any) =>
    (u.profile?.persona as any)?.interests as string[] | undefined;
  const currentInterests = getInterests(currentUser) || [];
  const targetInterests = getInterests(targetUser) || [];
  const sharedInterests = currentInterests.filter((i) =>
    targetInterests.includes(i),
  );
  {
    const maxScore = isTravelMode ? 15 : 18;
    const points = Math.min(sharedInterests.length * 3, maxScore); // 3pts each
    result.breakdown.interests = {
      score: points,
      distinct: targetInterests,
      shared: sharedInterests,
    };
  }

  // --- 4. Location (Standard: 12%, Travel: 5%) ---
  {
    const maxScore = isTravelMode ? 5 : 12;
    let locScore = 0;
    const sameCity =
      !!currentUser.currentCityId &&
      !!targetUser.currentCityId &&
      currentUser.currentCityId === targetUser.currentCityId;

    const currentCountryId = currentUser.currentCity?.country?.id;
    const targetCountryId = targetUser.currentCity?.country?.id;
    const sameCountry =
      !!currentCountryId &&
      !!targetCountryId &&
      currentCountryId === targetCountryId;

    if (sameCity) {
      locScore = maxScore;
    } else if (sameCountry) {
      locScore = Math.floor(maxScore / 2);
    }
    result.breakdown.location.score = locScore;
    result.breakdown.location.sameCity = sameCity;
    result.breakdown.location.sameCountry = sameCountry;
  }

  // --- 5. Age (Standard: 8%) ---
  {
    // Max 8
    let ageScore = 0;
    let diff = 0;
    let isWithin = false;
    if (currentUser.profile?.birthday && targetUser.profile?.birthday) {
      const age1 = getAge(currentUser.profile.birthday);
      const age2 = getAge(targetUser.profile.birthday);
      diff = Math.abs(age1 - age2);
      isWithin = diff <= 2;
      if (isWithin) ageScore = 8;
      else if (diff <= 5) ageScore = 4;
      else if (diff <= 10) ageScore = 2;
    }
    result.breakdown.age = {
      score: ageScore,
      isWithinRange: isWithin,
      diffYears: diff,
    };
  }

  // --- 6. Friends (Standard: 15%) ---
  {
    const getFriendIds = (u: any) => {
      const sent = u.friendshipsRequested
        .filter((f: any) => f.status === "ACCEPTED")
        .map((f: any) => f.addresseeId);
      const received = u.friendshipsReceived
        .filter((f: any) => f.status === "ACCEPTED")
        .map((f: any) => f.requesterId);
      return new Set<string>([...sent, ...received]);
    };
    const friendsA = getFriendIds(currentUser);
    const friendsB = getFriendIds(targetUser);
    const mutualIds = [...friendsA].filter((id) => friendsB.has(id));
    const points = Math.min(mutualIds.length * 5, 15);

    // Quick names fetch could go here if needed, skipping for performace or keeping simplified
    result.breakdown.friends = {
      score: points,
      count: mutualIds.length,
      mutualNames: [],
    };
  }

  // --- 7. Future Plans (Standard: 0%, Travel: 15%) ---
  {
    if (isTravelMode) {
      // Check overlapping city visits in future
      const now = new Date();
      // @ts-ignore - cityVisits included in repo but type might not fully infer
      const currentFuture = (currentUser.cityVisits || []).filter(
        (v: any) => v.endDate && new Date(v.endDate) > now,
      );
      // @ts-ignore
      const targetFuture = (targetUser.cityVisits || []).filter(
        (v: any) => v.endDate && new Date(v.endDate) > now,
      );

      // Simple check: same city?
      // In real world we check date overlap. Here let's just check shared future destinations.
      const extractCityIds = (list: any[]) => list.map((v) => v.cityId);
      const myFutureCities = new Set(extractCityIds(currentFuture));
      const theirFutureCities = new Set(extractCityIds(targetFuture));

      const sharedDestinations = [...myFutureCities].filter((c) =>
        theirFutureCities.has(c),
      );

      // 15 pts if at least one shared future trip
      const score = sharedDestinations.length > 0 ? 15 : 0;

      result.breakdown.futurePlans = {
        score,
        count: sharedDestinations.length,
        sharedDestinations: sharedDestinations, // these are IDs provided here
      };
    }
  }

  // --- 8. Travel Style (Standard: 10%, Travel: 12%) ---
  {
    const maxScore = isTravelMode ? 12 : 10;
    const getStyle = (u: any) =>
      (u.profile?.persona as any)?.travelStyle as string | undefined;
    const s1 = getStyle(currentUser);
    const s2 = getStyle(targetUser);

    let styleScore = 0;
    if (s1 && s2 && s1 === s2) {
      styleScore = maxScore;
    }
    result.breakdown.travelStyle = {
      score: styleScore,
      styles: s2 ? [s2] : [],
      shared: s1 && s2 && s1 === s2 ? [s1] : [],
    };
  }

  // --- 9. Proximity (Standard: 2%, Travel: 0%) ---
  {
    let dist: number | null = null;
    let proxScore = 0;
    if (!isTravelMode) {
      // Calculate distance
      // User.currentLocation is Json [lng, lat]
      const c1 = currentUser.currentLocation as unknown as number[];
      const c2 = targetUser.currentLocation as unknown as number[];

      if (
        Array.isArray(c1) &&
        Array.isArray(c2) &&
        c1.length === 2 &&
        c2.length === 2
      ) {
        const [lng1, lat1] = c1;
        const [lng2, lat2] = c2;
        dist = getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2);

        if (dist <= 20)
          proxScore = 2; // < 20km
        else if (dist <= 50) proxScore = 1;
      }
    }
    result.breakdown.proximity = {
      score: proxScore,
      distanceKm: dist,
    };
  }

  // --- Final Score ---
  result.score =
    result.breakdown.languages.score +
    result.breakdown.places.score +
    result.breakdown.interests.score +
    result.breakdown.location.score +
    result.breakdown.age.score +
    result.breakdown.friends.score +
    result.breakdown.futurePlans.score +
    result.breakdown.travelStyle.score +
    result.breakdown.proximity.score;

  // Cap at 100 just in case
  result.score = Math.min(Math.round(result.score), 100);

  return result;
}
