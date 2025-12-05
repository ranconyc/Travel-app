import { Avatar } from "@/app/component/common/Avatar";
import HeaderWrapper from "@/app/component/common/Header";
import React from "react";

type Props = {};

function Header({ chatId }: { chatId: string }) {
  return (
    <HeaderWrapper>
      <h1 className="font-bold text-2xl">Chat {chatId}</h1>
    </HeaderWrapper>
  );
}

function ChatBubble() {
  return (
    <div className="flex flex-col gap-2">
      <div className="p-2 bg-white border border-gray-100 rounded-xl rounded-bl-none shadow-xl w-fit">
        Hello, how are you?
      </div>
      <div className="flex items-start gap-2">
        <Avatar size={24} />
        <h2 className=" text-xs">John Doe</h2>
      </div>
    </div>
  );
}

export default async function ChatPage({ params }) {
  const { id } = await params;
  return (
    <div>
      <Header chatId={id} />
      <main className="p-2">
        <ChatBubble />
      </main>
    </div>
  );
}
