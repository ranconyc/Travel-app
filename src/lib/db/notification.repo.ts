import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export async function getNotifications(userId: string, limit: number = 20) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function createNotification(data: Prisma.NotificationCreateInput) {
  return prisma.notification.create({
    data,
  });
}

export async function markNotificationAsRead(id: string) {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function markAllNotificationsAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

export async function markNotificationAsSeen(id: string) {
  return prisma.notification.update({
    where: { id },
    data: { isSeen: true },
  });
}
