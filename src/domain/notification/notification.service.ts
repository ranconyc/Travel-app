import { triggerRealTimeEvent } from "@/lib/pusher";
import { NotificationType } from "@prisma/client";
import {
  getNotifications as getNotificationsRepo,
  createNotification as createNotificationRepo,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  markNotificationAsSeen,
} from "@/lib/db/notification.repo";

export interface CreateNotificationOptions {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

/**
 * Get notifications for a user
 */
export async function getNotifications(userId: string, limit: number = 20) {
  return getNotificationsRepo(userId, limit);
}

/**
 * Creates a notification, saves it to the DB, and triggers a Pusher event.
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  data = {},
}: CreateNotificationOptions) {
  try {
    // 1. Persist to Database
    const notification = await createNotificationRepo({
      user: { connect: { id: userId } },
      type,
      title,
      message,
      data,
    });

    // 2. Trigger Real-Time Event (Pusher)
    // Channel: user-{userId}
    // Event: notification:new
    await triggerRealTimeEvent(
      `user-${userId}`,
      "notification:new",
      notification,
    );

    console.log(`[NotificationService] Alert created for ${userId}: ${type}`);
    return notification;
  } catch (error) {
    console.error("[NotificationService] Error creating notification:", error);
    // We don't throw here to avoid breaking the calling flow (e.g. chat save)
    return null;
  }
}

/**
 * Centralized trigger for any real-time event.
 */
export async function triggerEvent(channel: string, event: string, data: any) {
  return triggerRealTimeEvent(channel, event, data);
}

/**
 * Mark a single notification as read.
 */
export async function markAsRead(notificationId: string) {
  return markNotificationAsRead(notificationId);
}

/**
 * Mark all notifications for a user as read.
 */
export async function markAllAsRead(userId: string) {
  return markAllNotificationsAsRead(userId);
}

/**
 * Mark a notification as seen (for badge counts).
 */
export async function markAsSeen(notificationId: string) {
  return markNotificationAsSeen(notificationId);
}
