"use server";

import { createSafeAction } from "@/lib/safe-action";
import { getNotifications, markAllAsRead } from "./notification.service";
import {
  GetNotificationsSchema,
  NotificationVoidSchema,
} from "./notification.schema";

/**
 * Get notifications for the current authenticated user.
 */
export const getNotificationsAction = createSafeAction(
  GetNotificationsSchema,
  async (data, userId) => {
    return await getNotifications(userId, data.limit);
  },
);

/**
 * Mark all notifications as read for the current authenticated user.
 */
export const markAllNotificationsReadAction = createSafeAction(
  NotificationVoidSchema,
  async (_data, userId) => {
    await markAllAsRead(userId);

    return { success: true };
  },
);
