"use server";

import { z } from "zod";
import { createSafeAction } from "@/lib/safe-action";
import {
  createMessage,
  findChatById,
  findChatMember,
  findOrCreatePrivateChat,
  findUserChats,
  markMessagesAsRead as markReadRepo,
} from "@/lib/db/chat.repo";
import { getFriends } from "@/lib/db/friendship.repo";

/**
 * Get all chats for the current user with last message and unread count
 */
export const getUserChats = createSafeAction(z.any(), async (_, userId) => {
  return await findUserChats(userId);
});

/**
 * Get a specific chat by ID with all messages
 */
export const getChatById = createSafeAction(
  z.object({ chatId: z.string() }),
  async ({ chatId }, userId) => {
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
  },
);

/**
 * Send a message in a chat
 */
export const sendMessage = createSafeAction(
  z.object({
    chatId: z.string(),
    content: z.string().min(1, "Message cannot be empty"),
  }),
  async ({ chatId, content }, userId) => {
    // Verify user is a member of the chat
    const chatMember = await findChatMember(chatId, userId);

    if (!chatMember) {
      throw new Error("Unauthorized - not a member of this chat");
    }

    return await createMessage(chatId, userId, content);
  },
);

/**
 * Mark all messages in a chat as read for the current user
 */
export const markMessagesAsRead = createSafeAction(
  z.object({ chatId: z.string() }),
  async ({ chatId }, userId) => {
    await markReadRepo(chatId, userId);
  },
);

/**
 * Create a new chat with another user or get existing chat
 * Returns the chat ID for navigation
 */
export const createOrGetChat = createSafeAction(
  z.object({ otherUserId: z.string() }),
  async ({ otherUserId }, userId) => {
    return await findOrCreatePrivateChat(userId, otherUserId);
  },
);

/**
 * Get all accepted friends for the current user
 */
export const getUserFriends = createSafeAction(z.any(), async (_, userId) => {
  return await getFriends(userId);
});
