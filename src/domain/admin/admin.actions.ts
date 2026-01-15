"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getAdminStats,
  getTopTrendingCities,
  findLatestUsers,
  type LatestUser,
} from "@/lib/db/admin.repo";
import { getUserRole } from "@/lib/db/user.repo";

// Helper to check admin status
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  const role = await getUserRole(session.user.id);

  if (role !== "ADMIN") {
    redirect("/");
  }

  return session.user.id;
}

export async function getDashboardStats() {
  await checkAdminAuth();
  return getAdminStats();
}

export async function getTopCities() {
  await checkAdminAuth();
  return getTopTrendingCities();
}

export async function getLatestUsers(): Promise<LatestUser[]> {
  await checkAdminAuth();
  return findLatestUsers();
}
