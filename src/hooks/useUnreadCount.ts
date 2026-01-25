"use client";

import { useCallback } from "react";
import { useAppStore } from "@/store/appStore";
import { useRealTime } from "@/hooks/useRealTime";
import { useUser } from "@/app/providers/UserProvider";

/**
 * Hook to manage and sync unread message count across the application
 */
export function useUnreadCount() {
  const user = useUser();
  const { unreadCount, setUnreadCount } = useAppStore();

  const handleNewMessage = useCallback(
    (message: { chatId: string }) => {
      // Only increment if we're not currently looking at this chat
      const currentPath = window.location.pathname;
      if (!currentPath.includes(`/chats/${message.chatId}`)) {
        setUnreadCount(unreadCount + 1);
      }
    },
    [unreadCount, setUnreadCount],
  );

  // Listen for new messages globally for the user's private channel
  useRealTime(
    user?.id ? `user-${user.id}` : null,
    "message-notification",
    handleNewMessage,
  );

  return unreadCount;
}
