"use server";

import { getAllStates } from "@/lib/db/state.repo";

export async function getAllStatesAction(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  try {
    const result = await getAllStates(params);
    return { success: true, ...result };
  } catch (error) {
    console.error("Failed to fetch states:", error);
    return { success: false, error: "Failed to fetch states" };
  }
}
