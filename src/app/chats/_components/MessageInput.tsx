"use client";

import { sendMessage } from "@/domain/chat/chat.actions";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/lib/socket/useWebSocket";
import { useUser } from "@/app/providers/UserProvider";
import type { MessageInputProps } from "@/types/chat";

export function MessageInput({ chatId }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const { emit, isConnected } = useWebSocket();
  const user = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSending) return;

    const messageContent = content;
    const tempId = `temp-${Date.now()}`; // Temporary ID for optimistic UI
    setContent(""); // Optimistic UI - clear immediately
    setIsSending(true);

    try {
      // Try WebSocket first
      if (isConnected && user?.id) {
        const success = emit("send-message", {
          chatId,
          content: messageContent,
          tempId,
          userId: user.id,
        });

        if (success) {
          console.log("✅ Message sent via WebSocket");
          setIsSending(false);
          return;
        }
      }

      // Fallback to HTTP if WebSocket not available
      console.log("⚠️ WebSocket not available, using HTTP fallback");
      const res = await sendMessage({ chatId, content: messageContent });
      if (!res.success) {
        toast.error(res.error || "Failed to send message");
      }
      router.refresh();
      setIsSending(false);
    } catch (error) {
      console.error("Failed to send message:", error);
      setContent(messageContent); // Restore on error
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
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 p-4 fixed bottom-0 left-0 right-0 z-50 bg-white"
    >
      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!content.trim() || isSending}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Press Enter to send, Shift+Enter for new line
        {isConnected && " • 🟢 Real-time"}
        {!isConnected && " • 🔴 Offline mode"}
      </p>
    </form>
  );
}
