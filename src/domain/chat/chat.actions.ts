"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
export async function getUserChats() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.warn("[getUserChats] Unauthorized access attempt");
      throw new Error("Unauthorized");
    }

    const chats = await findUserChats(session.user.id);
    return chats;
  } catch (error) {
    console.error("[getUserChats] Failed to fetch chats:", error);
    // Re-throw the error so the UI can handle it (or Show Error Boundary)
    // We could return [] here to fail silently, but for critical data, erroring is often better.
    if (error instanceof Error && error.message === "Unauthorized") {
      throw error;
    }
    throw new Error("Failed to load your chats. Please try again later.");
  }
}

/**
 * Get a specific chat by ID with all messages
 */
export async function getChatById(chatId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const chat = await findChatById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  // Verify user is a member of this chat
  const isMember = chat.members.some(
    (member) => member.userId === session.user.id
  );
  if (!isMember) {
    throw new Error("Unauthorized - not a member of this chat");
  }

  // Mark messages as read
  await markMessagesAsRead(chatId, session.user.id);

  return chat;
}

/**
 * Send a message in a chat
 */
export async function sendMessage(chatId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify user is a member of the chat
  const chatMember = await findChatMember(chatId, session.user.id);

  if (!chatMember) {
    throw new Error("Unauthorized - not a member of this chat");
  }

  return createMessage(chatId, session.user.id, content);
}

/**
 * Mark all messages in a chat as read for the current user
 */
export async function markMessagesAsRead(chatId: string, userId: string) {
  return markReadRepo(chatId, userId);
}

/**
 * Create a new chat with another user or get existing chat
 * Returns the chat ID for navigation
 */
export async function createOrGetChat(otherUserId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return findOrCreatePrivateChat(session.user.id, otherUserId);
}

/**
 * Get all accepted friends for the current user
 */
export async function getUserFriends() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return getFriends(session.user.id);
}
