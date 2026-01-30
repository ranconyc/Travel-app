import { Media } from "@/domain/media/media.schema";

export interface ChatUserRef {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  profile?: {
    firstName: string | null;
    lastName: string | null;
  } | null;
  media?: Media[];
}

export interface ChatMember {
  userId: string;
  user: ChatUserRef;
}

export interface ChatMessageRef {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date | string;
}

export interface ChatWithDetails {
  id: string;
  isGroup: boolean;
  groupName: string | null;
  groupImage: string | null;
  lastMessageId: string | null;
  updatedAt: Date | string;
  createdAt: Date | string;
  members: ChatMember[];
  lastMessage?: ChatMessageRef | null;
}
