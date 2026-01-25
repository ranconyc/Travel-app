"use client";

import { useState, useCallback, useMemo } from "react";
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
      // If we have an optimistic message with a tempId that matches logic, we should replace it.
      // However, usually the real message ID is different.
      // We deduplicate by ID.
      const exists = prev.some((m) => m.id === newMessage.id);
      if (exists) return prev;

      // If we have a temp message that matches the content and sender (rudimentary matching),
      // we might want to replace it, but proper optimistic UI often removes the temp one upon success
      // or the server returns the same UUID if generated client-side.
      // For now, simpler approach: Deduplicate exact IDs.
      return [...prev, newMessage];
    });
    setOtherUserTyping(false); // Stop typing indicator on message
  }, []);

  const handleTyping = useCallback(
    (data: { userId: string }) => {
      if (data.userId !== user?.id) {
        setOtherUserTyping(true);
        // Auto-clear after 3 seconds of no events
        setTimeout(() => setOtherUserTyping(false), 3000);
      }
    },
    [user?.id],
  );

  // Subscribe to new messages
  useRealTime(`chat-${chatId}`, "new-message", handleNewMessage);

  // Subscribe to typing events
  useRealTime(`chat-${chatId}`, "client-typing", handleTyping);

  // --- Optimistic Mutation ---

  const { mutateAsync: sendMessageMutation, isPending: isSending } =
    useMutation({
      mutationFn: async (content: string) => {
        return await sendMessage({ chatId, content });
      },
      onMutate: async (content) => {
        // 1. Create Optimistic Message
        const tempId = crypto.randomUUID();
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
        toast.error("Failed to send message");
      },
      onSuccess: (data, content, context) => {
        // 4. Replace Optimistic Message with Real One (or let Pusher do it)
        // Since Pusher will trigger 'handleNewMessage', we mostly just need to remove the temp one
        // OR update the temp one to 'sent' if we want to smooth transition.
        // Ideally, the server response (data.data) contains the real message.
        if (data.success && data.data) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === context?.tempId ? { ...data.data!, status: "sent" } : m,
            ),
          );
        }
      },
      onSettled: () => {
        // 5. Sync with DB (Optional if Pusher is reliable, but good practice)
        // queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
      },
    });

  // --- Typing Logic ---

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
    sendMessage: sendMessageMutation,
    isSending,
    otherUserTyping,
  };
}
