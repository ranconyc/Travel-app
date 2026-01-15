"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

// Helper to check admin status
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  return session.user.id;
}

export async function getDashboardStats() {
  await checkAdminAuth();

  const totalUsers = await prisma.user.count();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Active users: Users who have logged (updated session) or modified profile in last 7 days
  const activeUsers = await prisma.user.count({
    where: {
      updatedAt: {
        gte: sevenDaysAgo,
      },
    },
  });

  const totalCities = await prisma.city.count();
  const totalCountries = await prisma.country.count();

  return {
    totalUsers,
    activeUsers,
    totalCities,
    totalCountries,
  };
}

export async function getTopCities() {
  await checkAdminAuth();

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
    take: 5,
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
    })
  );

  return citiesWithDetails.filter(
    (c): c is NonNullable<typeof c> => c !== null
  );
}

type LatestUser = {
  id: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  createdAt: Date;
};

export async function getLatestUsers(): Promise<LatestUser[]> {
  await checkAdminAuth();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      avatarUrl: true,
    },
  });

  return users;
}
