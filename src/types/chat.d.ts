/**
 * Chat-related type definitions
 * Based on domain/chat/chat.schema.ts
 */

/**
 * Message in a chat with sender information
 */
export type Message = {
  id: string;
  content: string;
  createdAt: Date;
  senderId: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
    profile?: {
      firstName: string | null;
      lastName: string | null;
    } | null;
    images?: Array<{ url: string; isMain: boolean }>;
  };
  readBy?: string[];
  tempId?: string; // For optimistic UI
};

/**
 * Chat member with read status
 */
export type ChatMember = {
  id: string;
  chatId: string;
  userId: string;
  lastReadAt: Date | null;
  user?: {
    id: string;
    name: string | null;
    image: string | null;
    profile?: {
      firstName: string | null;
      lastName: string | null;
    } | null;
    images?: Array<{ url: string; isMain: boolean }>;
  };
};

/**
 * Chat conversation with members and messages
 */
export type Chat = {
  id: string;
  isGroup: boolean;
  groupName?: string | null;
  groupImage?: string | null;
  lastMessageId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  members?: ChatMember[];
  messages?: Message[];
  lastMessage?: Message | null;
};

/**
 * Props for message input component
 */
export type MessageInputProps = {
  chatId: string;
};

/**
 * Props for message list component
 */
export type MessageListProps = {
  messages: Message[];
  currentUserId: string;
  chatId: string;
};
