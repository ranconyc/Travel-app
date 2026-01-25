import { ChatShell } from "@/features/chats/components/ChatShell";
import { getChatById } from "@/domain/chat/chat.actions";
import { getChatDisplayName } from "@/domain/chat/chat.utils";
import { getCurrentUser } from "@/lib/auth/get-current-user";
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
      <ChatShell title="Chat Not Found" input={null}>
        <div className="flex-1 flex items-center justify-center p-xl">
          <p className="text-center text-secondary">
            {result.error ||
              "This chat doesn't exist or you don't have access to it."}
          </p>
        </div>
      </ChatShell>
    );
  }

  const chat = result.data;
  const chatName = getChatDisplayName(chat, loggedUser.id);

  return (
    <ChatShell
      title={chatName}
      subtitle="Conversation"
      input={<MessageInput chatId={id} />}
    >
      <MessageList messages={chat.messages} chatId={id} />
    </ChatShell>
  );
}
