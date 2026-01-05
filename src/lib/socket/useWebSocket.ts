"use client";

import { useEffect, useCallback, useState } from "react";
import { useSocket } from "./socket-context";
import type { EventCallback } from "@/types/socket";

/* Custom hook for using WebSocket in components */
export function useWebSocket() {
  const { socket, isConnected, isUserOnline } = useSocket();

  /* Emit an event to the server */
  const emit = useCallback(
    (event: string, data?: any) => {
      if (!socket || !isConnected) {
        console.warn("Socket not connected, cannot emit:", event);
        return false;
      }
      socket.emit(event, data);
      return true;
    },
    [socket, isConnected]
  );

  /* Listen to an event from the server */
  const on = useCallback(
    (event: string, callback: EventCallback) => {
      if (!socket) return;
      socket.on(event, callback);
    },
    [socket]
  );

  /* Remove event listener */
  const off = useCallback(
    (event: string, callback?: EventCallback) => {
      if (!socket) return;
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
    },
    [socket]
  );

  return {
    socket,
    isConnected,
    isUserOnline,
    emit,
    on,
    off,
  };
}

/* Hook for joining/leaving chat rooms */
export function useChatRoom(chatId: string | null) {
  const { emit, on, off } = useWebSocket();

  useEffect(() => {
    if (!chatId) return;

    // Join the chat room
    emit("join-chat", chatId);

    // Cleanup: leave the room when component unmounts or chatId changes
    return () => {
      emit("leave-chat", chatId);
    };
  }, [chatId, emit]);

  return { on, off, emit };
}

/* Hook to track total unread message count across all chats */
export function useUnreadCount() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket, isConnected, userId } = useSocket(); // Assuming userId is available from useSocket context

  useEffect(() => {
    if (!socket || !isConnected || !userId) return; // Ensure userId is available

    // Request initial unread count from server
    socket.emit("get-unread-count", { userId }); // Pass userId with the event

    // Listen for unread count updates
    const handleUnreadCount = (count: number) => {
      setUnreadCount(count);
    };

    socket.on("unread-count", handleUnreadCount);

    // Listen for new messages to increment count
    const handleNewMessage = (message: {
      chatId: string;
      senderId: string;
    }) => {
      // Only increment if we're not in that chat
      // (the chat page will mark as read automatically)
      const currentPath = window.location.pathname;
      if (!currentPath.includes(`/chat/${message.chatId}`)) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("new-message", handleNewMessage);

    // Listen for messages marked as read
    const handleMessagesRead = () => {
      // Request updated count
      socket.emit("get-unread-count");
    };

    socket.on("messages-read", handleMessagesRead);

    return () => {
      socket.off("unread-count", handleUnreadCount);
      socket.off("new-message", handleNewMessage);
      socket.off("messages-read", handleMessagesRead);
    };
  }, [socket, isConnected]);

  return unreadCount;
}
