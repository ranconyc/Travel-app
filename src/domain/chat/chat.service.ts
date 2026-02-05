import {
  createMessage,
  findChatById,
  findChatMember,
  findOrCreatePrivateChat,
  findUserChats,
  markMessagesAsRead as markReadRepo,
} from "@/lib/db/chat.repo";

import { sendPushNotification } from "@/lib/beams";

import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { Message } from "@/types/chat.d";

/**
 * Domain-specific logic for resolving a sender's display name.
 * Centralized here to handle fallbacks consistently across the app.
 */
export function getMessageSenderName(sender: Message["sender"]): string {
  return (
    sender.name ||
    `${sender.profile?.firstName || ""} ${sender.profile?.lastName || ""}`.trim() ||
    "Unknown"
  );
}

/**
 * Standardized timestamp formatting for messages.
 */
export function formatTimestamp(date: Date | string): string {
  const messageDate = typeof date === "string" ? new Date(date) : date;

  if (isToday(messageDate)) {
    return formatDistanceToNow(messageDate, { addSuffix: true }).replace(
      "minutes",
      "min",
    );
  }

  if (isYesterday(messageDate)) {
    return `Yesterday ${format(messageDate, "h:mm a")}`;
  }

  return format(messageDate, "MMM d, h:mm a");
}

export async function handleGetUserChats(userId: string) {
  return await findUserChats(userId);
}

export async function handleGetChatById(chatId: string, userId: string) {
  const chat = await findChatById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  // Verify user is a member of this chat
  const isMember = chat.members.some((member) => member.userId === userId);
  if (!isMember) {
    throw new Error("Unauthorized - not a member of this chat");
  }

  // Mark messages as read
  await markReadRepo(chatId, userId);

  return chat;
}

export async function handleSendMessage(
  chatId: string,
  userId: string,
  content: string,
) {
  // Verify user is a member of the chat
  const chatMember = await findChatMember(chatId, userId);

  if (!chatMember) {
    throw new Error("Unauthorized - not a member of this chat");
  }

  const message = await createMessage(chatId, userId, content);

  // Trigger real-time event via NotificationService (Centralized)
  const { triggerEvent } =
    await import("@/domain/notification/notification.service");
  await triggerEvent(`chat-${chatId}`, "new-message", message);

  // Send Notifications
  const chat = await findChatById(chatId);
  if (chat) {
    const recipients = chat.members
      .filter((m) => m.userId !== userId)
      .map((m) => `user-${m.userId}`);

    if (recipients.length > 0) {
      const senderName = getMessageSenderName(message.sender);
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

      // 1. Trigger standard push (Beams)
      await sendPushNotification(recipients, {
        title: senderName,
        body: content,
        deep_link: `${baseUrl}/chats/${chatId}`,
      });

      // 2. Persist in-app and trigger Pusher
      const { createNotification } =
        await import("@/domain/notification/notification.service");
      await Promise.all(
        chat.members
          .filter((m) => m.userId !== userId)
          .map((m) =>
            createNotification({
              userId: m.userId,
              type: "MESSAGE",
              title: senderName,
              message: content,
              data: { chatId, messageId: message.id },
            }),
          ),
      );
    }
  }

  return message;
}

export async function handleMarkMessagesAsRead(chatId: string, userId: string) {
  await markReadRepo(chatId, userId);
}

export async function handleCreateOrGetChat(
  userId: string,
  otherUserId: string,
) {
  return await findOrCreatePrivateChat(userId, otherUserId);
}
