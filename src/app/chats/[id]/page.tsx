import { Avatar } from "@/app/components/common/Avatar";
import HeaderWrapper from "@/app/components/common/Header";
import React from "react";
import { getChatById } from "@/domain/chat/chat.actions";
import {
  getChatDisplayName,
  getChatDisplayImage,
} from "@/domain/chat/chat.utils";
import { getCurrentUser, getSession } from "@/lib/auth/get-current-user";
import { MessageList } from "@/app/chats/_components/MessageList";
import { MessageInput } from "@/app/chats/_components/MessageInput";
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
    <HeaderWrapper
      backButton
      className="flex items-end justify-between sticky top-0 z-50 border-b border-gray-200"
    >
      <div className="flex flex-col items-start">
        <p className="text-primery text-lg">Your chat with</p>
        <h1 className="text-3xl font-bold capitalize min-h-[40px] flex items-center">
          {chatName}
        </h1>
      </div>
      {/* <Avatar image={chatImage || undefined} size={80} variant="square" /> */}
    </HeaderWrapper>
  );
}

export default async function ChatPage({ params }: Props) {
  const loggedUser = await getCurrentUser();

  if (!loggedUser) {
    redirect("/signin");
  }

  const { id } = await params;
  const result = await getChatById({ chatId: id });

  if (!result.success) {
    return (
      <div>
        <HeaderWrapper backButton>
          <h1 className="font-bold text-xl">Chat Not Found</h1>
        </HeaderWrapper>
        <main className="p-4">
          <p className="text-center text-gray-500">
            {result.error ||
              "This chat doesn't exist or you don't have access to it."}
          </p>
        </main>
      </div>
    );
  }

  const chat = result.data;
  const chatName = getChatDisplayName(chat, loggedUser.id);
  const chatImage = getChatDisplayImage(chat, loggedUser.id);

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader chatName={chatName} chatImage={chatImage} />
      <MessageList
        messages={chat.messages}
        currentUserId={loggedUser.id}
        chatId={id}
      />
      <MessageInput chatId={id} />
    </div>
  );
}
