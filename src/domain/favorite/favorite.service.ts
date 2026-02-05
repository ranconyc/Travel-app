import { FavoriteType } from "@prisma/client";
import {
  findFavorite,
  deleteFavorite,
  createFavorite,
  getFavorites as getFavoritesRepo,
} from "@/lib/db/favorite.repo";

/**
 * Service for managing user favorites.
 */
/**
 * Toggle a favorite (add if not exists, remove if exists).
 */
export async function toggleFavorite(
  userId: string,
  type: FavoriteType,
  entityId: string,
) {
  // Check if already favorited
  const existing = await findFavorite(userId, type, entityId);

  if (existing) {
    // Remove favorite
    await deleteFavorite(existing.id);
    return { isFavorited: false };
  } else {
    // Add favorite
    await createFavorite(userId, type, entityId);
    return { isFavorited: true };
  }
}

/**
 * Check if an entity is favorited by the current user.
 */
export async function isFavorited(
  userId: string,
  type: FavoriteType,
  entityId: string,
) {
  const existing = await findFavorite(userId, type, entityId);

  return { isFavorited: !!existing };
}

/**
 * Get the current user's favorites, optionally filtered by type.
 */
export async function getFavorites(userId: string, type?: FavoriteType) {
  return getFavoritesRepo(userId, type);
}
