"use client";

import React, { memo } from "react";
import { Avatar } from "@/components/molecules/Avatar";
import Typography from "@/components/atoms/Typography";
import {
  getMessageSenderName,
  formatTimestamp,
} from "@/domain/chat/chat.service";
import type { Message } from "@/types/chat.d";

interface ChatMessageBubbleProps {
  message: Message;
  isSent: boolean;
  showSenderName: boolean;
  showTime: boolean;
}

const ChatMessageBubble = memo(
  ({ message, isSent, showSenderName, showTime }: ChatMessageBubbleProps) => {
    const senderName = getMessageSenderName(message.sender);

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
              className="whitespace-pre-wrap wrap-break-word leading-relaxed"
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
              {formatTimestamp(message.createdAt)}
            </Typography>
          )}
        </div>
      </div>
    );
  },
);

ChatMessageBubble.displayName = "ChatMessageBubble";

export default ChatMessageBubble;
