"use client";

import { Avatar } from "@/components/molecules/Avatar";
import { formatMessageTime } from "@/domain/chat/chat.utils";
import { useEffect, useRef, useState, useCallback, memo } from "react";
import { useRealTime } from "@/hooks/useRealTime";
import type { Message } from "@/types/chat";
import { useUser } from "@/app/providers/UserProvider";
import Typography from "@/components/atoms/Typography";

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
  showSenderName: boolean;
  showTime: boolean;
}

const MessageBubble = memo(
  ({ message, isSent, showSenderName, showTime }: MessageBubbleProps) => {
    const senderName =
      message.sender.name ||
      `${message.sender.profile?.firstName || ""} ${
        message.sender.profile?.lastName || ""
      }`.trim() ||
      "Unknown";

    return (
      <div
        className={`flex gap-2 ${isSent ? "flex-row-reverse" : "flex-row items-end"}`}
      >
        {!isSent && (
          <Avatar
            className="-mb-3 border-2 border-white shadow-sm"
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
          className={`flex flex-col ${isSent ? "items-end" : "items-start"} max-w-[80%]`}
        >
          {showSenderName && !isSent && (
            <Typography
              variant="tiny"
              color="sec"
              className="mb-1 ml-1 px-xs uppercase tracking-widest font-bold"
            >
              {senderName}
            </Typography>
          )}
          <div
            className={`px-md py-sm rounded-2xl shadow-sm ${
              isSent
                ? "bg-brand text-white rounded-br-none"
                : "bg-surface text-txt-main rounded-bl-none border border-stroke"
            }`}
          >
            <Typography
              variant="p"
              className="whitespace-pre-wrap break-words leading-relaxed"
            >
              {message.content}
            </Typography>
          </div>
          {showTime && (
            <Typography
              variant="micro"
              color="sec"
              className={`mt-1 px-xs ${isSent ? "text-right" : "text-left"} opacity-70`}
            >
              {formatMessageTime(message.createdAt)}
            </Typography>
          )}
        </div>
      </div>
    );
  },
);

MessageBubble.displayName = "MessageBubble";

export function MessageList({
  messages: initialMessages,
  chatId,
}: {
  messages: Message[];
  chatId: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const user = useUser();

  const handleNewMessage = useCallback((newMessage: Message) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === newMessage.id);
      if (exists) return prev;
      return [...prev, newMessage];
    });
  }, []);

  useRealTime(`chat-${chatId}`, "new-message", handleNewMessage);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) return null;

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-xl text-center space-y-md">
        <div className="w-16 h-16 bg-bg-sub rounded-full flex items-center justify-center text-txt-sec">
          <Typography variant="h2">💬</Typography>
        </div>
        <Typography variant="p" color="sec">
          No messages yet. Start the conversation!
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-md py-lg space-y-6 no-scrollbar">
      {messages.map((message, index) => {
        const isSent = message.senderId === user.id;
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const isSameSender = prevMessage?.senderId === message.senderId;

        return (
          <MessageBubble
            key={message.id}
            message={message}
            isSent={isSent}
            showSenderName={!isSameSender}
            showTime={
              index === messages.length - 1 ||
              messages[index + 1]?.senderId !== message.senderId
            }
          />
        );
      })}
      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
