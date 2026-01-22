import {
  createMessage,
  findChatById,
  findChatMember,
  findOrCreatePrivateChat,
  findUserChats,
  markMessagesAsRead as markReadRepo,
} from "@/lib/db/chat.repo";
import { getFriends } from "@/lib/db/friendship.repo";

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

  return await createMessage(chatId, userId, content);
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

export async function handleGetUserFriends(userId: string) {
  return await getFriends(userId);
}
