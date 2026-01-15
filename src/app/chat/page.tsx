import React from "react";
import HeaderWrapper from "../component/common/Header";
import { Avatar } from "../component/common/Avatar";
import Link from "next/link";
import { getUserChats, getUserFriends } from "@/domain/chat/chat.actions";
import {
  getChatDisplayName,
  getChatDisplayImage,
  getUnreadCount,
  formatMessageTime,
  truncateText,
} from "@/domain/chat/chat.utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MessageButton } from "./MessageButton";

function Header() {
  return (
    <HeaderWrapper backButton={true}>
      <h1 className="font-bold text-2xl">Chats</h1>
    </HeaderWrapper>
  );
}

function ChatItem({
  chat,
  currentUserId,
}: {
  chat: Awaited<ReturnType<typeof getUserChats>>[number];
  currentUserId: string;
}) {
  const displayName = getChatDisplayName(chat, currentUserId);
  const displayImage = getChatDisplayImage(chat, currentUserId);
  const unreadCount = getUnreadCount(chat.messages);
  const lastMessageText = chat.lastMessage?.content || "No messages yet";
  const lastMessageTime = chat.lastMessage?.createdAt
    ? formatMessageTime(chat.lastMessage.createdAt)
    : "";

  return (
    <Link href={`/chat/${chat.id}`}>
      <li className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100">
        <Avatar image={displayImage || undefined} size={48} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-gray-900 truncate">
              {displayName}
            </h2>
            {lastMessageTime && (
              <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                {lastMessageTime}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 truncate">
              {truncateText(lastMessageText, 40)}
            </p>
            {unreadCount > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </li>
    </Link>
  );
}

function ChatsList({
  chats,
  currentUserId,
}: {
  chats: Awaited<ReturnType<typeof getUserChats>>;
  currentUserId: string;
}) {
  if (!chats || chats.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 px-4 py-2">
        Messages
      </h2>
      <ul className="flex flex-col">
        {chats.map((chat) => (
          <ChatItem key={chat.id} chat={chat} currentUserId={currentUserId} />
        ))}
      </ul>
    </div>
  );
}

function FriendItem({
  friend,
}: {
  friend: Awaited<ReturnType<typeof getUserFriends>>[number];
}) {
  const displayName =
    friend.profile?.firstName && friend.profile?.lastName
      ? `${friend.profile.firstName} ${friend.profile.lastName}`
      : friend.name || "Unknown";

  return (
    <li className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100">
      <Avatar
        image={
          friend.images?.find((img) => img.isMain)?.url ||
          friend.image ||
          undefined
        }
        size={48}
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{displayName}</h3>
      </div>
      <MessageButton friendId={friend.id} />
    </li>
  );
}

function FriendsList({
  friends,
}: {
  friends: Awaited<ReturnType<typeof getUserFriends>>;
}) {
  if (!friends || friends.length === 0) {
    return (
      <div className="pt-44 text-center grid place-items-center border border-red-500">
        <p className="text-lg mb-2">No friends yet</p>
        <p className="text-sm text-gray-500 w-2/3 mx-auto">
          Find some mates in the nearby section to start chatting!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 px-4 py-2">Friends</h2>
      <ul className="flex flex-col">
        {friends.map((friend) => (
          <FriendItem key={friend.id} friend={friend} />
        ))}
      </ul>
    </div>
  );
}

export default async function ChatsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div>
        <Header />
        <main className="p-4">
          <p className="text-center text-gray-500">
            Please sign in to view your chats
          </p>
        </main>
      </div>
    );
  }

  const [chats, friends] = await Promise.all([
    getUserChats(),
    getUserFriends(),
  ]);

  return (
    <React.Fragment>
      <Header />
      <main className="h-full border border-green-500">
        <ChatsList chats={chats} currentUserId={session.user.id} />
        <FriendsList friends={friends} />
      </main>
    </React.Fragment>
  );
}
