import PageHeader from "@/components/molecules/PageHeader";
import React from "react";
import { getChatById } from "@/domain/chat/chat.actions";
import {
  getChatDisplayName,
  getChatDisplayImage,
} from "@/domain/chat/chat.utils";
import { getCurrentUser, getSession } from "@/lib/auth/get-current-user";
import { MessageList } from "@/features/chats/components/MessageList";
import { MessageInput } from "@/features/chats/components/MessageInput";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

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
        <PageHeader backButton title="Chat Not Found" />
        <main className="p-md">
          <p className="text-center text-secondary">
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
      <PageHeader
        backButton
        subtitle="Your chat with"
        title={chatName}
        // rightContent={<Avatar image={chatImage || undefined} size={40} />} // Optional: if we want to show avatar
      />
      <MessageList
        messages={chat.messages}
        currentUserId={loggedUser.id}
        chatId={id}
      />
      <MessageInput chatId={id} />
    </div>
  );
}
