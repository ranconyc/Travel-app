"use server";

import { createSafeAction } from "@/lib/safe-action";
import { FavoriteInputSchema, GetFavoritesSchema } from "./favorite.schema";
import { toggleFavorite, isFavorited, getFavorites } from "./favorite.service";

/**
 * Toggle a favorite (add if not exists, remove if exists).
 * Uses the @@unique constraint to check existence.
 */
export const toggleFavoriteAction = createSafeAction(
  FavoriteInputSchema,
  async (data, userId) => {
    return await toggleFavorite(userId, data.type, data.entityId);
  },
);

/**
 * Check if an entity is favorited by the current user.
 */
export const isFavoriteAction = createSafeAction(
  FavoriteInputSchema,
  async (data, userId) => {
    return await isFavorited(userId, data.type, data.entityId);
  },
);

/**
 * Get the current user's favorites, optionally filtered by type.
 */
export const getFavoritesAction = createSafeAction(
  GetFavoritesSchema,
  async (data, userId) => {
    return await getFavorites(userId, data.type);
  },
);
