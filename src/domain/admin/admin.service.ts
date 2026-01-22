import {
  getAdminStats,
  getTopTrendingCities,
  findLatestUsers,
} from "@/lib/db/admin.repo";

export async function handleGetAdminStats() {
  return await getAdminStats();
}

export async function handleGetTopTrendingCities() {
  return await getTopTrendingCities();
}

export async function handleFindLatestUsers() {
  return await findLatestUsers();
}
