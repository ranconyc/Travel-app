import { getTravelHistory } from "@/domain/user/travelHistory.queries";
import { getUserById, UserWithRelations } from "@/lib/db/user.repo";
import { getCountriesByCodes } from "@/lib/db/country.repo";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    // Get all travel data sources
    const [cityVisits, user] = await Promise.all([
      getTravelHistory(userId, 100),
      getUserById(userId, { strategy: "full" }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Cast user to UserWithRelations since we used strategy: "full"
    const fullUser = user as UserWithRelations;

    // Get visited countries data
    const visitedCountryCodes = (fullUser as any).visitedCountries || [];
    const visitedCountries = await getCountriesByCodes(visitedCountryCodes);

    // Create a Set of city IDs that have detailed visit records
    const cityVisitIds = new Set(cityVisits.map((v) => v.cityId));

    // Merge all sources into a unified display list
    const mergedHistory = [];

    // 1. Add all city visits (most detailed data)
    cityVisits.forEach((visit) => {
      mergedHistory.push({
        id: visit.id,
        type: "city" as const,
        cityId: visit.cityId,
        cityName: visit.city.name,
        countryName: visit.city.country?.name || "",
        countryCode: visit.city.country?.code || "",
        date: visit.startDate,
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
          type: "country" as const,
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
        type: "city" as const,
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

    return NextResponse.json({ visits: mergedHistory });
  } catch (error) {
    console.error("Travel history API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch travel history" },
      { status: 500 },
    );
  }
}
