"use server";

import { z } from "zod";
import { createAdminAction } from "@/lib/safe-action";
import {
  handleGetAdminStats,
  handleGetTopTrendingCities,
  handleFindLatestUsers,
} from "@/domain/admin/admin.service";
// Auth checks are now handled by createAdminAction

export const getDashboardStats = createAdminAction(
  z.object({}).optional(),
  async () => {
    return await handleGetAdminStats();
  },
);

export const getTopCities = createAdminAction(
  z.object({}).optional(),
  async () => {
    return await handleGetTopTrendingCities();
  },
);

export const getLatestUsers = createAdminAction(
  z.object({}).optional(),
  async () => {
    return await handleFindLatestUsers();
  },
);
