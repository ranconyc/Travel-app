import { prisma } from "@/lib/db/prisma";
import { Prisma, MediaCategory } from "@prisma/client";

export async function createMedia(data: Prisma.MediaCreateInput) {
  return prisma.media.create({
    data,
  });
}

export async function getUserMedia(userId: string, category?: MediaCategory) {
  return prisma.media.findMany({
    where: {
      userId,
      ...(category && { category }),
    },
    orderBy: { createdAt: "desc" },
  });
}
