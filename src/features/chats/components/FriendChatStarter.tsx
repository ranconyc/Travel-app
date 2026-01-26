"use client";

import { createOrGetChat } from "@/domain/chat/chat.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/molecules/Avatar";

interface FriendChatStarterProps {
  friendId: string;
  friendName: string;
  friendImage?: string | null;
}

export function FriendChatStarter({
  friendId,
  friendName,
  friendImage,
}: FriendChatStarterProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await createOrGetChat({ otherUserId: friendId });
      if (result.success) {
        router.push(`/chats/${result.data}`);
      } else {
        console.error("Failed to create or get chat:", result.error);
        // Maybe show a toast here if available
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`transition-opacity hover:opacity-80 active:scale-95 duration-200 ${
        loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
      aria-label={`Start chat with ${friendName}`}
    >
      <Avatar
        image={friendImage || undefined}
        alt={friendName}
        size={48}
        variant="square"
      />
    </button>
  );
}
