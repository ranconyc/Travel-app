import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";

/**
 * Get the display name for a chat
 * For 1-on-1 chats: other participant's name
 * For group chats: group name
 */
export function getChatDisplayName(
  chat: {
    isGroup: boolean;
    groupName: string | null;
    members: Array<{
      user: {
        id: string;
        name: string | null;
        firstName: string | null;
        lastName: string | null;
      };
    }>;
  },
  currentUserId: string
): string {
  if (chat.isGroup) {
    return chat.groupName || "Group Chat";
  }

  // For 1-on-1, get the other participant
  const otherMember = chat.members.find((m) => m.user.id !== currentUserId);
  if (!otherMember) {
    return "Unknown User";
  }

  return (
    otherMember.user.name ||
    `${otherMember.user.firstName || ""} ${
      otherMember.user.lastName || ""
    }`.trim() ||
    "Unknown User"
  );
}

/**
 * Get the display image for a chat
 * For 1-on-1 chats: other participant's avatar
 * For group chats: group image
 */
export function getChatDisplayImage(
  chat: {
    isGroup: boolean;
    groupImage: string | null;
    members: Array<{
      user: {
        id: string;
        image: string | null;
      };
    }>;
  },
  currentUserId: string
): string | null {
  if (chat.isGroup) {
    return chat.groupImage;
  }

  // For 1-on-1, get the other participant's image
  const otherMember = chat.members.find((m) => m.user.id !== currentUserId);
  return otherMember?.user.image || null;
}

/**
 * Get the other participant in a 1-on-1 chat
 */
export function getOtherParticipant<T extends { user: { id: string } }>(
  chatMembers: T[],
  currentUserId: string
): T | undefined {
  return chatMembers.find((m) => m.user.id !== currentUserId);
}

/**
 * Calculate unread message count
 */
export function getUnreadCount(
  messages: Array<{ id: string }> | undefined
): number {
  return messages?.length || 0;
}

/**
 * Format message timestamp
 * - "2m ago" for recent messages
 * - "Yesterday 3:45 PM" for yesterday
 * - "Dec 3, 3:45 PM" for older messages
 */
export function formatMessageTime(date: Date | string): string {
  const messageDate = typeof date === "string" ? new Date(date) : date;

  if (isToday(messageDate)) {
    return formatDistanceToNow(messageDate, { addSuffix: true });
  }

  if (isYesterday(messageDate)) {
    return `Yesterday ${format(messageDate, "h:mm a")}`;
  }

  return format(messageDate, "MMM d, h:mm a");
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + "...";
}
