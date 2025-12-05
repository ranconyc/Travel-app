import { z } from "zod";

// --- MESSAGE Schema ---

export const Message = z.object({
  id: z.string().optional(), // @id @default(auto()) @map("_id")

  chatId: z.string(), // @db.ObjectId
  senderId: z.string(), // @db.ObjectId
  content: z.string().min(1, "Message content cannot be empty."),

  // Array of user IDs who have read the message
  readBy: z.array(z.string()).default([]).optional(),

  // Relations/Metadata
  createdAt: z
    .date()
    .default(() => new Date())
    .optional(),

  // Note: The `chatLastMessage` relation is a back-relation, usually omitted in input schemas.
});

export type TMessage = z.infer<typeof Message>;

// --- CHAT MEMBER Schema ---

export const ChatMember = z.object({
  id: z.string().optional(), // @id @default(auto()) @map("_id")

  chatId: z.string(), // @db.ObjectId
  userId: z.string(), // @db.ObjectId

  // To track where a user last left off (useful for unread counts)
  lastReadAt: z.date().nullable().optional(),
});

export type TChatMember = z.infer<typeof ChatMember>;

// --- CHAT Schema ---

/**
 * Zod schema for the Chat model.
 * Represents a conversation thread (one-to-one or group).
 */
export const Chat = z.object({
  id: z.string().optional(), // @id @default(auto()) @map("_id")

  isGroup: z.boolean().default(false).optional(),
  groupName: z.string().nullable().optional(), // Name for group chats
  groupImage: z.string().url().nullable().optional(), // Optional image URL for group chats

  // ID of the last message for display purposes
  lastMessageId: z.string().nullable().optional(), // @db.ObjectId

  // Relations/Metadata
  createdAt: z
    .date()
    .default(() => new Date())
    .optional(),
  updatedAt: z.date().optional(),

  // Note: The 'members' and 'messages' relations are typically handled via separate API calls
  // but you could nest them if performing an aggregated read (e.g., ZChat.extend({ members: z.array(ZChatMember) }))
});

export type TChat = z.infer<typeof Chat>;
