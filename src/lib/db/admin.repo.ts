/**
 * Admin dashboard repository
 * Handles database queries for admin statistics and review items
 */

import { prisma } from "@/lib/db/prisma";

/**
 * Get admin dashboard statistics
 */
export async function getAdminStats() {
  const [totalUsers, totalCountries, totalCities] = await Promise.all([
    prisma.user.count(),
    prisma.country.count(),
    prisma.city.count(),
  ]);

  return {
    totalUsers,
    totalCountries,
    totalCities,
  };
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
        countryId: true,
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
