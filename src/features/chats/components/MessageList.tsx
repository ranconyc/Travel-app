"use client";

import { Avatar } from "@/components/molecules/Avatar";
import { formatMessageTime } from "@/domain/chat/chat.utils";
import { useEffect, useRef, useState } from "react";
import { useChatRoom } from "@/lib/socket/useWebSocket";
import type { Message, MessageListProps } from "@/types/chat";

export function MessageList({
  messages: initialMessages,
  currentUserId,
  chatId,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const { on, off } = useChatRoom(chatId);

  // Listen for new messages via WebSocket
  useEffect(() => {
    const handleNewMessage = (...args: unknown[]) => {
      const newMessage = args[0] as Message;
      console.log("📨 Received new message:", newMessage);

      setMessages((prev) => {
        // Remove temp message if it exists (optimistic UI)
        const withoutTemp = newMessage.tempId
          ? prev.filter((m) => m.id !== newMessage.tempId)
          : prev;

        // Add new message if it doesn't already exist
        const exists = withoutTemp.some((m) => m.id === newMessage.id);
        if (exists) return prev;

        return [...withoutTemp, newMessage];
      });
    };

    on("new-message", handleNewMessage);

    return () => {
      off("new-message", handleNewMessage);
    };
  }, [on, off]);

  // Auto-scroll to bottom on mount and when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-secondary">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-md space-y-4">
      {messages.map((message, index) => {
        const isSent = message.senderId === currentUserId;
        const senderName =
          message.sender.name ||
          `${message.sender.profile?.firstName || ""} ${
            message.sender.profile?.lastName || ""
          }`.trim() ||
          "Unknown";

        return (
          <div
            key={message.id}
            className={`flex gap-2 ${isSent ? "flex-row-reverse " : "flex-row items-end"}`}
          >
            {!isSent && (
              <Avatar
                className="-mb-3"
                image={
                  message.sender.media?.find((img) => img.category === "AVATAR")
                    ?.url ||
                  message.sender.avatarUrl ||
                  undefined
                }
                name={senderName}
                size={32}
              />
            )}
            <div
              className={`flex flex-col ${
                isSent ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-md px-3 p-2 rounded-lg ${
                  isSent
                    ? "bg-black text-white dark:bg-surface-secondary dark:text-white rounded-br-xs"
                    : "bg-surface rounded-bl-xs"
                }`}
              >
                {!isSent && (
                  <span className="text-xs text-secondary mb-1">
                    {senderName}
                  </span>
                )}
                <p className="whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                {messages.length - 1 === index && (
                  <span className="text-xs text-secondary mt-1 text-right w-full block">
                    {formatMessageTime(message.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
