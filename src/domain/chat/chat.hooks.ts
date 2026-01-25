"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRealTime } from "@/hooks/useRealTime";
import type { Message } from "@/types/chat.d";
import { useUser } from "@/app/providers/UserProvider";
import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "@/domain/chat/chat.actions";
import { toast } from "sonner";

/**
 * useChat - Logic wrapper for real-time chat sessions.
 * Manages message state, real-time sync via Pusher, grouping logic, and Optimistic UI.
 */
export function useChat(chatId: string, initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const user = useUser();

  // --- Real-Time Listeners ---

  const handleNewMessage = useCallback((newMessage: Message) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === newMessage.id);
      if (exists) return prev;
      return [...prev, newMessage];
    });
    setOtherUserTyping(false);
  }, []);

  const handleTyping = useCallback(
    (data: { userId: string }) => {
      if (data.userId !== user?.id) {
        setOtherUserTyping(true);
        setTimeout(() => setOtherUserTyping(false), 3000);
      }
    },
    [user?.id],
  );

  // Subscribe to new messages
  useRealTime(`chat-${chatId}`, "new-message", handleNewMessage);

  // Subscribe to typing events
  useRealTime(`chat-${chatId}`, "client-typing", handleTyping);

  // Sync with initialMessages when they change (e.g. server revalidation or navigation)
  useEffect(() => {
    setMessages((prev) => {
      // Keep optimistically sending messages that aren't confirmed yet
      const sendingMessages = prev.filter((m) => m.status === "sending");

      const newIds = new Set(initialMessages.map((m) => m.id));
      const stillSending = sendingMessages.filter((m) => !newIds.has(m.id));

      return [...initialMessages, ...stillSending];
    });
  }, [initialMessages]);

  // --- Optimistic Mutation ---

  const { mutateAsync: sendMessageMutation, isPending: isSending } =
    useMutation({
      mutationFn: async (content: string) => {
        return await sendMessage({ chatId, content });
      },
      onMutate: async (content) => {
        // 1. Create Optimistic Message
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

        const optimisticMessage: Message = {
          id: tempId,
          content,
          createdAt: new Date(),
          senderId: user?.id || "unknown",
          sender: {
            id: user?.id || "unknown",
            name: user?.name || "Me",
            avatarUrl: user?.avatarUrl || null,
            profile: {
              firstName: user?.profile?.firstName || user?.name || "Me",
              lastName: user?.profile?.lastName || "",
            },
            media: user?.media || [],
          },
          readBy: [],
          tempId,
          status: "sending",
        };

        // 2. Update UI immediately
        setMessages((prev) => [...prev, optimisticMessage]);

        return { tempId };
      },
      onError: (err, content, context) => {
        // 3. Rollback on error
        if (context?.tempId) {
          setMessages((prev) => prev.filter((m) => m.id !== context.tempId));
        }
        toast.error(
          "Failed to send message: " +
            (err instanceof Error ? err.message : "Unknown error"),
        );
      },
      onSuccess: (data, content, context) => {
        // 4. Update status or replace
        if (data.success && data.data) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === context?.tempId ? { ...data.data!, status: "sent" } : m,
            ),
          );
        } else {
          if (context?.tempId) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === context?.tempId ? { ...m, status: "error" } : m,
              ),
            );
          }
          const errorMessage =
            (!data.success && "error" in data ? data.error : null) ||
            "Message sent but server returned error";
          toast.error(errorMessage);
        }
      },
    });

  /**
   * Identifies boundaries between different senders for better UI grouping.
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
    sendMessage: sendMessageMutation,
    isSending,
    otherUserTyping,
  };
}
