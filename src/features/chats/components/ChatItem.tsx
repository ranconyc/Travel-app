"use client";

import { Avatar } from "@/components/molecules/Avatar";
import Link from "next/link";
import {
  getChatDisplayName,
  getChatDisplayImage,
} from "@/domain/chat/chat.utils";

export default function ChatItem({
  chat,
  loggedUserId,
}: {
  chat: any;
  loggedUserId: string;
}) {
  const otherMember = chat.members.find(
    (member: any) => member.userId !== loggedUserId,
  );

  const otherUser = otherMember?.user;

  if (!otherUser) return null;

  const displayName = getChatDisplayName(chat, loggedUserId);
  const displayImage = getChatDisplayImage(chat, loggedUserId);

  const lastMessageContent = chat.lastMessage?.content || "No messages yet";

  return (
    <li className="list-none border-b border-surface/5 last:border-0 w-full">
      <Link
        href={`/chats/${chat.id}`}
        className="flex items-center gap-md p-md hover:bg-surface/10 transition-colors duration-200"
      >
        <Avatar
          image={displayImage || undefined}
          name={displayName}
          size={56}
          variant="square"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="font-bold text-lg truncate">{displayName}</h3>
            {chat.updatedAt && (
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(chat.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm truncate">
            {lastMessageContent}
          </p>
        </div>
      </Link>
    </li>
  );
}
