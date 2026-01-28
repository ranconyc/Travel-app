import { getTravelHistory } from "@/domain/user/travelHistory.queries";
import { getUserById, UserWithRelations } from "@/lib/db/user.repo";
import { getCountriesByCodes } from "@/lib/db/country.repo";

export type TravelHistoryItem = {
  id: string;
  type: "city" | "country";
  cityId: string | null;
  cityName: string;
  countryName: string;
  countryCode: string;
  date: Date | null;
  isVerified?: boolean;
  source?: string;
  isCurrent: boolean;
};

export async function getUnifiedTravelHistory(
  userId: string,
  preFetchedUser?: UserWithRelations | null,
): Promise<TravelHistoryItem[]> {
  // If user is provided, don't fetch it again
  const userPromise = preFetchedUser
    ? Promise.resolve(preFetchedUser)
    : getUserById(userId, { strategy: "full" });

  // Get all travel data sources
  const [cityVisits, user] = await Promise.all([
    getTravelHistory(userId, 100),
    userPromise,
  ]);

  if (!user) {
    throw new Error("User not found");
  }

  // Cast user to UserWithRelations since we used strategy: "full"
  const fullUser = user as UserWithRelations;

  // Get visited countries data
  // Using 'any' cast as in original code to bypass potential type mismatches, though we should fix strict types later
  const visitedCountryCodes = (fullUser as any).visitedCountries || [];
  const visitedCountries = await getCountriesByCodes(visitedCountryCodes);

  // Create a Set of city IDs that have detailed visit records
  const cityVisitIds = new Set(cityVisits.map((v) => v.cityId));

  // Merge all sources into a unified display list
  const mergedHistory: TravelHistoryItem[] = [];

  // 1. Add all city visits (most detailed data)
  cityVisits.forEach((visit) => {
    mergedHistory.push({
      id: visit.id,
      type: "city",
      cityId: visit.cityId,
      cityName: visit.city.name,
      countryName: visit.city.country?.name || "",
      countryCode: visit.city.country?.code || "",
      date: visit.startDate,
      isVerified: visit.isVerified,
      source: visit.source,
      isCurrent:
        visit.endDate === null && visit.cityId === fullUser.currentCityId,
    });
  });

  // 2. Add visited countries (only if no city visit exists for cities in those countries)
  // For now, we'll show countries at the country level since we don't have city details
  visitedCountries.forEach((country) => {
    // Check if this country already has city visits
    const hasVisitsInCountry = cityVisits.some(
      (v) => v.city.country?.code === country.code,
    );

    // Only add if no detailed city visits exist for this country
    if (!hasVisitsInCountry) {
      mergedHistory.push({
        id: `country-${country.code}`,
        type: "country",
        cityId: null,
        cityName: country.name,
        countryName: country.name,
        countryCode: country.code,
        date: null,
        isCurrent: false,
      });
    }
  });

  // 3. Ensure current city is included (if not already in visits)
  if (fullUser.currentCity && !cityVisitIds.has(fullUser.currentCityId!)) {
    mergedHistory.push({
      id: `current-${fullUser.currentCityId}`,
      type: "city",
      cityId: fullUser.currentCityId!,
      cityName: fullUser.currentCity.name,
      countryName: fullUser.currentCity.country?.name || "",
      countryCode: fullUser.currentCity.country?.code || "",
      date: new Date(),
      isCurrent: true,
    });
  }

  // Sort by date (most recent first), putting items without dates at the end
  mergedHistory.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Filter out duplicates: show a city/location only once per year
  const seen = new Set<string>();
  const filteredHistory = mergedHistory.filter((visit) => {
    const year = visit.date ? new Date(visit.date).getFullYear() : "no-date";
    // unique key based on location and year
    const locationKey = visit.cityId || visit.cityName || visit.countryCode;
    const key = `${locationKey}-${year}`;

    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  return filteredHistory;
}
