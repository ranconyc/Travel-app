"use client";

import { sendMessage } from "@/domain/chat/chat.actions";
import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import Button from "@/components/atoms/Button";
import ChatInputWrapper from "./ChatInputWrapper";

export function MessageInput({ chatId }: { chatId: string }) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSending) return;

    const messageContent = content;
    setContent("");
    setIsSending(true);

    try {
      const res = await sendMessage({ chatId, content: messageContent });

      if (!res.success) {
        toast.error(res.error || "Failed to send message");
        setContent(messageContent);
      }
    } catch (error) {
      console.error("[MessageInput] Failed to send message:", error);
      toast.error("An unexpected error occurred");
      setContent(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <ChatInputWrapper>
      <form
        onSubmit={handleSubmit}
        className="flex gap-xs items-end bg-bg-sub rounded-2xl p-xs border-2 border-transparent focus-within:border-brand/40 focus-within:bg-bg-main transition-all duration-300 shadow-soft"
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          className="flex-1 resize-none bg-transparent px-md py-xs  focus:outline-none text-txt-main placeholder:text-txt-sec/50 font-medium"
          rows={1}
          disabled={isSending}
        />
        <Button
          type="submit"
          disabled={!content.trim() || isSending}
          variant="primary"
          size="sm"
          className="h-10 w-10 rounded-lg flex items-center justify-center shadow-pill shrink-0"
          loading={isSending}
          icon={!isSending && <Send size={18} />}
        />
      </form>
    </ChatInputWrapper>
  );
}
