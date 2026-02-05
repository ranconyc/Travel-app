"use server";

import { z } from "zod";
import { createSafeAction } from "@/lib/safe-action";
import {
  handleGetUserChats,
  handleGetChatById,
  handleSendMessage,
  handleMarkMessagesAsRead,
  handleCreateOrGetChat,
} from "@/domain/chat/chat.service";

/**
 * Get all chats for the current user with last message and unread count
 */
export const getUserChats = createSafeAction(
  z.object({}).optional(),
  async (_, userId) => {
    return await handleGetUserChats(userId);
  },
);

/**
 * Get a specific chat by ID with all messages
 */
export const getChatById = createSafeAction(
  z.object({ chatId: z.string() }),
  async ({ chatId }, userId) => {
    return await handleGetChatById(chatId, userId);
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
    return await handleSendMessage(chatId, userId, content);
  },
);

/**
 * Mark all messages in a chat as read for the current user
 */
export const markMessagesAsRead = createSafeAction(
  z.object({ chatId: z.string() }),
  async ({ chatId }, userId) => {
    await handleMarkMessagesAsRead(chatId, userId);
  },
);

/**
 * Create a new chat with another user or get existing chat
 * Returns the chat ID for navigation
 */
export const createOrGetChat = createSafeAction(
  z.object({ otherUserId: z.string() }),
  async ({ otherUserId }, userId) => {
    return await handleCreateOrGetChat(userId, otherUserId);
  },
);
