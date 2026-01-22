"use client";

import { useState, useMemo } from "react";
import { getChatDisplayName } from "@/domain/chat/chat.utils";
import { FriendChatStarter } from "./FriendChatStarter";
import ChatItem from "./ChatItem";

interface ChatSearchClientProps {
  initialChats: any[];
  initialFriends: any[];
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
        chat.members.some((member: any) => member.userId === friend.id),
      );
    });

    if (!searchQuery.trim()) return friendsNotInChat;

    const query = searchQuery.toLowerCase();
    return friendsNotInChat.filter((friend) => {
      const fullName = `${friend.firstName} ${friend.lastName}`.toLowerCase();
      return fullName.includes(query);
    });
  }, [initialFriends, initialChats, searchQuery]);

  return (
    <div className="flex flex-col flex-1">
      <header className="p-4 pt-8 sticky top-0 bg-app-bg z-10">
        <p className="text-primery text-lg">Your</p>
        <h1 className="text-3xl font-bold capitalize mb-2 min-h-[40px] flex items-center">
          Chats
        </h1>
        <div className="relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full h-12 px-4 rounded-xl bg-surface/5 border border-surface/10 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all duration-200"
          />
        </div>
      </header>

      <main className="flex flex-col flex-1 pb-20">
        {filteredChats.length > 0 ? (
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4 mt-4">
              Recent Chats
            </h2>
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
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-4">
              {searchQuery.trim() ? "Search Mates" : "Discover Mates"}
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
              {filteredFriends.map((friend) => (
                <FriendChatStarter
                  key={friend.id}
                  friendId={friend.id}
                  friendName={`${friend.firstName} ${friend.lastName}`}
                  friendImage={friend.profilePicture}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
