"use client";

import { useRef, useEffect } from "react";
import type { Message } from "@/types/chat.d";
import EmptyState from "@/components/atoms/EmptyState";
import { useChat } from "@/domain/chat/chat.hooks";
import ChatMessageBubble from "./ChatMessageBubble";

export function MessageList({
  messages: initialMessages,
  chatId,
}: {
  messages: Message[];
  chatId: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messages, isEmpty, user } = useChat(chatId, initialMessages);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) return null;

  if (isEmpty) {
    return (
      <EmptyState
        title="No messages yet"
        description="Start the conversation!"
        icon={<span>💬</span>}
        className="flex-1"
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-md py-lg space-y-6 no-scrollbar">
      {messages.map((message) => (
        <ChatMessageBubble
          key={message.id}
          message={message}
          isSent={message.isSent}
          showSenderName={message.showSenderName}
          showTime={message.showTime}
        />
      ))}
      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
