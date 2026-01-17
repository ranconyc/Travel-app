"use client";

import { Avatar } from "@/app/components/common/Avatar";
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
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
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
            className={`flex gap-2 ${isSent ? "flex-row-reverse" : "flex-row"}`}
          >
            {!isSent && (
              <Avatar
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
              {!isSent && (
                <span className="text-xs text-gray-600 mb-1 px-2">
                  {senderName}
                </span>
              )}
              <div
                className={`max-w-md px-4 py-2 rounded-2xl ${
                  isSent
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-900 rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
              <span className="text-xs text-gray-500 mt-1 px-2">
                {formatMessageTime(message.createdAt)}
              </span>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
