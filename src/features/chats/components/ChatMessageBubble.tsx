"use client";

import React, { memo } from "react";
import { Avatar } from "@/components/molecules/Avatar";
import Typography from "@/components/atoms/Typography";
import {
  getMessageSenderName,
  formatTimestamp,
} from "@/domain/chat/chat.service";
import type { Message } from "@/types/chat.d";
import { motion } from "framer-motion";

interface ChatMessageBubbleProps {
  message: Message;
  isSent: boolean;
  showSenderName: boolean;
  showTime: boolean;
}

const ChatMessageBubble = memo(
  ({ message, isSent, showSenderName, showTime }: ChatMessageBubbleProps) => {
    const senderName = getMessageSenderName(message.sender);
    const isSending = message.status === "sending";

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: isSending ? 0.7 : 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
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
            size={36}
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
            className={`px-lg py-sm rounded-2xl shadow-sm transition-all  ${
              isSent
                ? "bg-brand rounded-br-none"
                : "bg-surface text-txt-main rounded-bl-none border border-stroke"
            }`}
          >
            <Typography
              variant="p"
              className="whitespace-pre-wrap wrap-break-word leading-relaxed text-white"
            >
              {message.content}
            </Typography>
          </div>
          <div className="flex items-center gap-1 mt-1 px-xs">
            {showTime && (
              <Typography
                variant="micro"
                color="sec"
                className={`${isSent ? "text-right" : "text-left"} opacity-70`}
              >
                {formatTimestamp(message.createdAt)}
              </Typography>
            )}
            {isSending && (
              <span className="text-[10px] text-brand/80 font-medium">
                Sending...
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  },
);

ChatMessageBubble.displayName = "ChatMessageBubble";

export default ChatMessageBubble;
