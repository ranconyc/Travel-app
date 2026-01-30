"use server";

import { z } from "zod";
import { createSafeAction } from "@/lib/safe-action";
import { prisma } from "@/lib/db/prisma";

/**
 * Get notifications for the current authenticated user.
 */
export const getNotificationsAction = createSafeAction(
  z.object({
    limit: z.number().optional().default(20),
  }),
  async (data, userId) => {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: data.limit,
    });

    return notifications;
  },
);

/**
 * Mark all notifications as read for the current authenticated user.
 */
export const markAllNotificationsReadAction = createSafeAction(
  z.object({}),
  async (_data, userId) => {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { success: true };
  },
);
