"use server";

import { createAdminAction } from "@/lib/safe-action";
import { AdminVoidSchema } from "./admin.schema";
import {
  handleGetAdminStats,
  handleGetTopTrendingCities,
  handleFindLatestUsers,
} from "@/domain/admin/admin.service";
// Auth checks are now handled by createAdminAction

export const getDashboardStats = createAdminAction(
  AdminVoidSchema,
  async () => {
    return await handleGetAdminStats();
  },
);

export const getTopCities = createAdminAction(AdminVoidSchema, async () => {
  return await handleGetTopTrendingCities();
});

export const getLatestUsers = createAdminAction(AdminVoidSchema, async () => {
  return await handleFindLatestUsers();
});
