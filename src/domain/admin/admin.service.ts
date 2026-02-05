import {
  countUsers,
  findLatestUsers,
  getUsersGroupedByCity,
} from "@/lib/db/user.repo";
import {
  countCountries,
  getCountriesNeedingReview,
} from "@/lib/db/country.repo";
import {
  countCities,
  getCitiesNeedingReview,
  getCityByIdWithCountry,
} from "@/lib/db/cityLocation.repo";
import { getPlacesNeedingReview } from "@/lib/db/place.repo";
import { getPopularSearches } from "@/lib/db/search.repo";
import { AdminDashboardStats, TopCity } from "@/domain/admin/admin.types";

export async function handleGetAdminStats(): Promise<AdminDashboardStats> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [totalUsers, totalCountries, totalCities, activeUsers] =
    await Promise.all([
      countUsers(),
      countCountries(),
      countCities(),
      countUsers({ updatedAfter: sevenDaysAgo }),
    ]);

  return {
    totalUsers,
    totalCountries,
    totalCities,
    activeUsers,
  };
}

export async function handleGetTopTrendingCities(
  limit = 5,
): Promise<TopCity[]> {
  const topCities = await getUsersGroupedByCity(limit);

  // Fetch city details
  const citiesWithDetails = await Promise.all(
    topCities.map(async (item) => {
      if (!item.currentCityId) return null;
      const city = await getCityByIdWithCountry(item.currentCityId);
      return {
        cityId: item.currentCityId,
        name: city?.name || "Unknown",
        country: city?.country?.name || "",
        countryCode: city?.country?.code || "",
        visitors: item._count.id,
      };
    }),
  );

  return citiesWithDetails.filter(
    (c): c is NonNullable<typeof c> => c !== null,
  );
}

export async function handleGetTopSearches(
  limit = 10,
  timeframe: import("@/domain/admin/admin.types").Timeframe = "all",
) {
  let dateFilter: Date | undefined;
  const now = new Date();

  switch (timeframe) {
    case "today":
      dateFilter = new Date(now.setHours(0, 0, 0, 0));
      break;
    case "week":
      dateFilter = new Date(now.setDate(now.getDate() - 7));
      break;
    case "month":
      dateFilter = new Date(now.setDate(now.getDate() - 30));
      break;
    case "all":
    default:
      dateFilter = undefined;
  }

  return await getPopularSearches(limit, dateFilter);
}

export async function handleFindLatestUsers() {
  return await findLatestUsers();
}

/**
 * Get items that need review
 */
export async function handleGetItemsNeedingReview() {
  const [countries, cities, places] = await Promise.all([
    getCountriesNeedingReview(),
    getCitiesNeedingReview(),
    getPlacesNeedingReview(),
  ]);

  return {
    countries,
    cities,
    places,
  };
}
