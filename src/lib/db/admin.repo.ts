/**
 * Admin dashboard repository
 * Handles database queries for admin statistics and review items
 */

import { prisma } from "@/lib/db/prisma";

export type AdminDashboardStats = {
  totalUsers: number;
  activeUsers: number;
  totalCities: number;
  totalCountries: number;
};

export type TopCity = {
  cityId: string;
  name: string;
  country: string;
  countryCode: string;
  visitors: number;
};

export type LatestUser = {
  id: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  createdAt: Date;
};

/**
 * Get admin dashboard statistics
 */
export async function getAdminStats(): Promise<AdminDashboardStats> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [totalUsers, totalCountries, totalCities, activeUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.country.count(),
      prisma.city.count(),
      prisma.user.count({
        where: {
          updatedAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
    ]);

  return {
    totalUsers,
    totalCountries,
    totalCities,
    activeUsers,
  };
}

/**
 * Get top trending cities based on user current locations
 */
export async function getTopTrendingCities(limit = 5): Promise<TopCity[]> {
  // Aggregate user current locations by city
  const topCities = await prisma.user.groupBy({
    by: ["currentCityId"],
    where: {
      currentCityId: { not: null },
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: limit,
  });

  // Fetch city details
  const citiesWithDetails = await Promise.all(
    topCities.map(async (item) => {
      if (!item.currentCityId) return null;
      const city = await prisma.city.findUnique({
        where: { id: item.currentCityId },
        select: { name: true, country: { select: { name: true, code: true } } },
      });
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

/**
 * Get latest registered users
 */
export async function findLatestUsers(limit = 5): Promise<LatestUser[]> {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      avatarUrl: true,
    },
  });
}

/**
 * Get items that need review
 */
export async function getItemsNeedingReview() {
  const [countries, cities, places] = await Promise.all([
    prisma.country.findMany({
      where: { needsReview: true },
      select: {
        id: true,
        cca3: true,
        name: true,
        code: true,
        autoCreated: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.city.findMany({
      where: { needsReview: true },
      select: {
        id: true,
        cityId: true,
        name: true,
        autoCreated: true,
        country: {
          select: {
            name: true,
            code: true,
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.place.findMany({
      where: { needsReview: true },
      select: {
        id: true,
        slug: true,
        name: true,
        autoCreated: true,
        createdAt: true,
        city: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    countries,
    cities,
    places,
  };
}

/**
 * Get top search queries
 */
export type Timeframe = "today" | "week" | "month" | "all";

export async function getTopSearches(limit = 10, timeframe: Timeframe = "all") {
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

  const topSearches = await prisma.searchEvent.groupBy({
    by: ["searchQuery"],
    where: dateFilter
      ? {
          timestamp: {
            gte: dateFilter,
          },
        }
      : undefined,
    _count: {
      searchQuery: true,
    },
    orderBy: {
      _count: {
        searchQuery: "desc",
      },
    },
    take: limit,
  });

  return topSearches.map((item) => ({
    query: item.searchQuery,
    count: item._count.searchQuery,
  }));
}
