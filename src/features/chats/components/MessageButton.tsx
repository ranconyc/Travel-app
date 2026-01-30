"use client";

import { createOrGetChat } from "@/domain/chat/chat.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/atoms/Button";

export function MessageButton({ friendId }: { friendId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleMessageClick = async () => {
    setIsLoading(true);
    try {
      const res = await createOrGetChat({ otherUserId: friendId });
      if (res.success) {
        router.push(`/chats/${res.data}`);
      } else {
        console.error(res.error || "Failed to start chat");
      }
    } catch (error) {
      console.error("Failed to create/get chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleMessageClick}
      loading={isLoading}
      disabled={isLoading}
      variant="primary"
      size="sm"
    >
      Message
    </Button>
  );
}
