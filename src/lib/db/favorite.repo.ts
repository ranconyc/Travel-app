import { prisma } from "@/lib/db/prisma";
import { FavoriteType } from "@prisma/client";

export async function findFavorite(
  userId: string,
  type: FavoriteType,
  entityId: string,
) {
  return prisma.favorite.findUnique({
    where: {
      userId_type_entityId: { userId, type, entityId },
    },
  });
}

export async function deleteFavorite(id: string) {
  return prisma.favorite.delete({
    where: { id },
  });
}

export async function createFavorite(
  userId: string,
  type: FavoriteType,
  entityId: string,
) {
  return prisma.favorite.create({
    data: { userId, type, entityId },
  });
}

export async function getFavorites(userId: string, type?: FavoriteType) {
  return prisma.favorite.findMany({
    where: {
      userId,
      ...(type && { type }),
    },
    orderBy: { createdAt: "desc" },
  });
}
