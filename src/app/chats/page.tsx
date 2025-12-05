import React from "react";
import HeaderWrapper from "../component/common/Header";
import { Avatar } from "../component/common/Avatar";
import Link from "next/link";

type Props = {};

function Header() {
  return (
    <HeaderWrapper>
      <h1 className="font-bold text-2xl">Chats</h1>
    </HeaderWrapper>
  );
}

function ChatItem({
  chat,
}: {
  chat: { chatId: string; name: string; lastMessage: string };
}) {
  return (
    <Link href={`/chats/${chat.chatId}`}>
      <li className="flex items-center gap-2 border border-red-500 p-2">
        <Avatar />
        <div>
          <h2 className="font-bold">{chat.name}</h2>
          <p className="text-sm">{chat.lastMessage}</p>
        </div>
      </li>
    </Link>
  );
}

function ChatsList({
  chats,
}: {
  chats: Array<{ chatId: string; name: string; lastMessage: string }> | null;
}) {
  if (!chats || chats.length === 0) {
    return <div>You have no chats, Find some mates</div>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {chats.map((chat) => (
        <ChatItem key={chat.chatId} chat={chat} />
      ))}
    </ul>
  );
}

export default function page({}: Props) {
  return (
    <div>
      <Header />
      <main className="p-2">
        <ChatsList
          chats={[
            {
              chatId: "1",
              name: "Chat 1",
              lastMessage: "Last message",
            },
            {
              chatId: "2",
              name: "Chat 2",
              lastMessage: "Last message",
            },
          ]}
        />
      </main>
    </div>
  );
}
