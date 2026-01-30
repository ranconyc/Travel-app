"use client";

import { useState, useMemo } from "react";
import { getChatDisplayName } from "@/domain/chat/chat.utils";
import { FriendChatStarter } from "./FriendChatStarter";
import ChatItem from "./ChatItem";

import PageHeader from "@/components/molecules/PageHeader";
import Input from "@/components/atoms/Input";
import Typography from "@/components/atoms/Typography";

import { ChatWithDetails } from "@/domain/chat/chat.types";
import { User } from "@/domain/user/user.schema";

interface ChatSearchClientProps {
  initialChats: ChatWithDetails[];
  initialFriends: User[];
  loggedUserId: string;
}

export function ChatSearchClient({
  initialChats,
  initialFriends,
  loggedUserId,
}: ChatSearchClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return initialChats;

    const query = searchQuery.toLowerCase();
    return initialChats.filter((chat) => {
      const displayName = getChatDisplayName(chat, loggedUserId).toLowerCase();
      // Also search by last message content if available
      const lastMessage = (chat.lastMessage?.content || "").toLowerCase();

      return displayName.includes(query) || lastMessage.includes(query);
    });
  }, [initialChats, searchQuery, loggedUserId]);

  const filteredFriends = useMemo(() => {
    // Current logic: only show friends not already in a chat
    const friendsNotInChat = initialFriends.filter((friend) => {
      return !initialChats.some((chat) =>
        chat.members.some((member) => member.userId === friend.id),
      );
    });

    if (!searchQuery.trim()) return friendsNotInChat;

    const query = searchQuery.toLowerCase();
    return friendsNotInChat.filter((friend) => {
      const fullName = `${friend.profile?.firstName || ""} ${
        friend.profile?.lastName || ""
      }`.toLowerCase();
      // Fallback to searching by name if profile name is empty (though rare for friends)
      const displayName = friend.name?.toLowerCase() || "";
      return fullName.includes(query) || displayName.includes(query);
    });
  }, [initialFriends, initialChats, searchQuery]);

  return (
    <div className="flex flex-col flex-1">
      <PageHeader
        subtitle="Your"
        title="Chats"
        bottomContent={
          <div className="relative">
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
            />
          </div>
        }
      />

      <main className="flex flex-col flex-1 pb-20 p-md">
        {filteredChats.length > 0 ? (
          <div className="flex-1">
            <Typography
              variant="label-sm"
              weight="bold"
              color="sec"
              className="uppercase tracking-wider "
            >
              Recent Chats
            </Typography>
            <ul className="flex flex-col w-full">
              {filteredChats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  loggedUserId={loggedUserId}
                />
              ))}
            </ul>
          </div>
        ) : searchQuery.trim() ? (
          <div className="flex flex-col items-center justify-center p-8 text-center mt-20">
            <h2 className="font-bold text-2xl mb-2">No results found</h2>
            <p className="text-muted-foreground max-w-[280px]">
              Try searching for someone else or check your spelling
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center mt-20">
            <h2 className="font-bold text-2xl mb-2">
              It’s a bit quiet in here...
            </h2>
            <p className="text-muted-foreground max-w-[280px]">
              {initialFriends.length > 0
                ? "Don't be shy! Reach out to one of your mates below and break the ice"
                : "No friends yet? Start matching with other travelers to start chatting!"}
            </p>
          </div>
        )}

        {filteredFriends.length > 0 && (
          <div className="mt-lg">
            <Typography
              variant="label-sm"
              weight="bold"
              color="sec"
              className="uppercase tracking-wider mb-md px-md"
            >
              {searchQuery.trim() ? "Search Mates" : "Discover Mates"}
            </Typography>
            <div className="flex gap-md overflow-x-auto pb-md px-md scrollbar-hide">
              {filteredFriends.map((friend) => (
                <FriendChatStarter
                  key={friend.id}
                  friendId={friend.id}
                  friendName={
                    friend.profile?.firstName
                      ? `${friend.profile.firstName} ${friend.profile.lastName || ""}`
                      : friend.name || "Unknown"
                  }
                  friendImage={friend.avatarUrl}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
