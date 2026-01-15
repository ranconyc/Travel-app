"use client";

import { createOrGetChat } from "@/domain/chat/chat.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function MessageButton({ friendId }: { friendId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleMessageClick = async () => {
    setIsLoading(true);
    try {
      const chatId = await createOrGetChat(friendId);
      router.push(`/chat/${chatId}`);
    } catch (error) {
      console.error("Failed to create/get chat:", error);
      alert("Failed to start chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleMessageClick}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      {isLoading ? "Loading..." : "Message"}
    </button>
  );
}
