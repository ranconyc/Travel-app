"use server";

import { z } from "zod";
import { createSafeAction } from "@/lib/safe-action";
import { prisma } from "@/lib/db/prisma";
import { FavoriteType } from "@prisma/client";

const FavoriteInputSchema = z.object({
  type: z.nativeEnum(FavoriteType),
  entityId: z.string(),
});

/**
 * Toggle a favorite (add if not exists, remove if exists).
 * Uses the @@unique constraint to check existence.
 */
export const toggleFavoriteAction = createSafeAction(
  FavoriteInputSchema,
  async (data, userId) => {
    const { type, entityId } = data;

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_type_entityId: { userId, type, entityId },
      },
    });

    if (existing) {
      // Remove favorite
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return { isFavorited: false };
    } else {
      // Add favorite
      await prisma.favorite.create({
        data: { userId, type, entityId },
      });
      return { isFavorited: true };
    }
  },
);

/**
 * Check if an entity is favorited by the current user.
 */
export const isFavoriteAction = createSafeAction(
  FavoriteInputSchema,
  async (data, userId) => {
    const { type, entityId } = data;

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_type_entityId: { userId, type, entityId },
      },
    });

    return { isFavorited: !!existing };
  },
);

const GetFavoritesSchema = z.object({
  type: z.nativeEnum(FavoriteType).optional(),
});

/**
 * Get the current user's favorites, optionally filtered by type.
 */
export const getFavoritesAction = createSafeAction(
  GetFavoritesSchema,
  async (data, userId) => {
    const { type } = data;

    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
        ...(type && { type }),
      },
      orderBy: { createdAt: "desc" },
    });

    return favorites;
  },
);
