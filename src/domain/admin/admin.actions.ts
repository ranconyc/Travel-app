"use server";

import { z } from "zod";
import { createAdminAction } from "@/lib/safe-action";
import { ActionResponse } from "@/types/actions";
import {
  handleGetAdminStats,
  handleGetTopTrendingCities,
  handleFindLatestUsers,
} from "@/domain/admin/admin.service";
// Auth checks are now handled by createAdminAction

export const getDashboardStats = createAdminAction(z.any(), async () => {
  return await handleGetAdminStats();
});

export const getTopCities = createAdminAction(z.any(), async () => {
  return await handleGetTopTrendingCities();
});

export const getLatestUsers = createAdminAction(z.any(), async () => {
  return await handleFindLatestUsers();
});
