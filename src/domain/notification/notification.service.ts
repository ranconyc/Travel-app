import { prisma } from "@/lib/db/prisma";
import { triggerRealTimeEvent } from "@/lib/pusher";
import { NotificationType } from "@prisma/client";

export interface CreateNotificationOptions {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

export const notificationService = {
  /**
   * Creates a notification, saves it to the DB, and triggers a Pusher event.
   */
  async createNotification({
    userId,
    type,
    title,
    message,
    data = {},
  }: CreateNotificationOptions) {
    try {
      // 1. Persist to Database
      const notification = await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          data,
        },
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
      console.error(
        "[NotificationService] Error creating notification:",
        error,
      );
      // We don't throw here to avoid breaking the calling flow (e.g. chat save)
      return null;
    }
  },

  /**
   * Centralized trigger for any real-time event.
   */
  async triggerEvent(channel: string, event: string, data: any) {
    return triggerRealTimeEvent(channel, event, data);
  },

  /**
   * Mark a single notification as read.
   */
  async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  },

  /**
   * Mark all notifications for a user as read.
   */
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },

  /**
   * Mark a notification as seen (for badge counts).
   */
  async markAsSeen(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isSeen: true },
    });
  },
};
