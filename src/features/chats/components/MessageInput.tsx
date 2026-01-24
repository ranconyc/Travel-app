"use client";

import { sendMessage } from "@/domain/chat/chat.actions";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/lib/socket/useWebSocket";
import { useUser } from "@/app/providers/UserProvider";
import type { MessageInputProps } from "@/types/chat";
import { Loader2, Send } from "lucide-react";

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
      className="m-4 rounded-full border border-gray-200 p-2 fixed bottom-4 left-0 right-0 z-50 bg-main 
             focus-within:border-brand focus-within:shadow-lg transition-all duration-200"
    >
      <div className="flex gap-2 justify-center items-center">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 resize-none rounded-full px-4 py-2 focus:outline-none bg-transparent"
          rows={1}
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!content.trim() || isSending}
          className="p-md rounded-full bg-brand text-white shadow-lg hover:bg-brand/80 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </form>
  );
}

{
  /* <p className="text-xs text-secondary mt-1">
  Press Enter to send, Shift+Enter for new line
  {isConnected && " • 🟢 Real-time"}
  {!isConnected && " • 🔴 Offline mode"}
</p> */
}
