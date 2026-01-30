"use client";

import { createOrGetChat } from "@/domain/chat/chat.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";

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
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      disabled={loading}
      aria-label={`Start chat with ${friendName}`}
      className="p-0"
    >
      <Avatar
        image={friendImage || undefined}
        alt={friendName}
        size={48}
        variant="square"
      />
    </Button>
  );
}
