import { Avatar } from "@/app/component/common/Avatar";
import HeaderWrapper from "@/app/component/common/Header";
import React from "react";
import { getChatById } from "@/domain/chat/chat.actions";
import {
  getChatDisplayName,
  getChatDisplayImage,
} from "@/domain/chat/chat.utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

async function ChatHeader({
  chatName,
  chatImage,
}: {
  chatName: string;
  chatImage: string | null;
}) {
  return (
    <HeaderWrapper backButton>
      <div className="flex items-center gap-3">
        <Avatar image={chatImage || undefined} size={40} />
        <h1 className="font-bold text-xl">{chatName}</h1>
      </div>
    </HeaderWrapper>
  );
}

export default async function ChatPage({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/signin");
  }

  let chat;
  try {
    chat = await getChatById(id);
  } catch (error) {
    return (
      <div>
        <HeaderWrapper backButton>
          <h1 className="font-bold text-xl">Chat Not Found</h1>
        </HeaderWrapper>
        <main className="p-4">
          <p className="text-center text-gray-500">
            This chat doesn&apos;t exist or you don&apos;t have access to it.
          </p>
        </main>
      </div>
    );
  }

  const chatName = getChatDisplayName(chat, session.user.id);
  const chatImage = getChatDisplayImage(chat, session.user.id);

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader chatName={chatName} chatImage={chatImage} />
      <MessageList
        messages={chat.messages}
        currentUserId={session.user.id}
        chatId={id}
      />
      <MessageInput chatId={id} />
    </div>
  );
}
