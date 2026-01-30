"use client";

import { useCallback } from "react";
import { useAppStore } from "@/store/appStore";
import { useRealTime } from "@/lib/hooks/useRealTime";
import { useUser } from "@/app/providers/UserProvider";

/**
 * Hook to manage and sync unread message count across the application
 * 
 * Uses functional state update to prevent subscription churn and memory leaks.
 */
export function useUnreadCount() {
  const user = useUser();
  const { unreadCount, setUnreadCount } = useAppStore();

  const handleNewMessage = useCallback(
    (message: { chatId: string }) => {
      // Only increment if we're not currently looking at this chat
      const currentPath = window.location.pathname;
      if (!currentPath.includes(`/chats/${message.chatId}`)) {
        // Use functional update to avoid dependency on unreadCount
        // This prevents the callback from changing on every count update
        setUnreadCount((prev) => prev + 1);
      }
    },
    [setUnreadCount], // Removed unreadCount from dependencies
  );

  // Listen for new messages globally for the user's private channel
  useRealTime(
    user?.id ? `user-${user.id}` : null,
    "message-notification",
    handleNewMessage,
  );

  return unreadCount;
}
