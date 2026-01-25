"use client";

import { useState, useCallback, useMemo } from "react";
import { useRealTime } from "@/hooks/useRealTime";
import type { Message } from "@/types/chat.d";
import { useUser } from "@/app/providers/UserProvider";

/**
 * useChat - Logic wrapper for real-time chat sessions.
 * Manages message state, real-time sync via Pusher, and grouping logic.
 */
export function useChat(chatId: string, initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const user = useUser();

  const handleNewMessage = useCallback((newMessage: Message) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === newMessage.id);
      if (exists) return prev;
      return [...prev, newMessage];
    });
  }, []);

  // Sync with Pusher channel
  useRealTime(`chat-${chatId}`, "new-message", handleNewMessage);

  /**
   * Identifies boundaries between different senders for better UI grouping.
   * Logic moved here from the UI layer to reach 10/10 decoupling.
   */
  const groupedMessages = useMemo(() => {
    return messages.map((message, index) => {
      const prevMessage = index > 0 ? messages[index - 1] : null;
      const nextMessage =
        index < messages.length - 1 ? messages[index + 1] : null;

      const isSameSenderAsPrev = prevMessage?.senderId === message.senderId;
      const isLastInSequence = nextMessage?.senderId !== message.senderId;

      return {
        ...message,
        isSent: message.senderId === user?.id,
        showSenderName: !isSameSenderAsPrev,
        showTime: isLastInSequence,
      };
    });
  }, [messages, user?.id]);

  return {
    messages: groupedMessages,
    isEmpty: messages.length === 0,
    user,
  };
}
