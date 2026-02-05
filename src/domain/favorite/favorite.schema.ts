import { z } from "zod";
import { FavoriteType } from "@prisma/client";

export const FavoriteInputSchema = z.object({
  type: z.nativeEnum(FavoriteType),
  entityId: z.string().min(1, "Entity ID is required"),
});

export type FavoriteInput = z.infer<typeof FavoriteInputSchema>;

export const GetFavoritesSchema = z.object({
  type: z.nativeEnum(FavoriteType).optional(),
});

export type GetFavoritesInput = z.infer<typeof GetFavoritesSchema>;
