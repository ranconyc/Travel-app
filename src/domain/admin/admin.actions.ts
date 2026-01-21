"use server";

import { z } from "zod";
import { createAdminAction } from "@/lib/safe-action";
import { ActionResponse } from "@/types/actions";
import {
  getAdminStats,
  getTopTrendingCities,
  findLatestUsers,
  type LatestUser,
} from "@/lib/db/admin.repo";
// Auth checks are now handled by createAdminAction

export const getDashboardStats = createAdminAction(z.any(), async () => {
  return await getAdminStats();
});

export const getTopCities = createAdminAction(z.any(), async () => {
  return await getTopTrendingCities();
});

export const getLatestUsers = createAdminAction(z.any(), async () => {
  return await findLatestUsers();
});
