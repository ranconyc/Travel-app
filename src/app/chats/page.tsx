import { getTravelPartnersAction } from "@/domain/friendship/friendship.actions";
import { ChatWithDetails } from "@/domain/chat/chat.types";
import { User } from "@/domain/user/user.schema";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { redirect } from "next/navigation";
import { getUserChats } from "@/domain/chat/chat.actions";
import { ChatSearchClient } from "@/features/chats/components/ChatSearchClient";

export default async function ChatPage() {
  const loggedUser = await getCurrentUser();

  if (!loggedUser) {
    redirect("/signin");
  }

  const [friendsResponse, chatsResponse] = await Promise.all([
    getTravelPartnersAction({}),
    getUserChats({}),
  ]);

  const initialFriends = friendsResponse.success ? friendsResponse.data : [];
  const initialChats = chatsResponse.success ? chatsResponse.data : [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ChatSearchClient
        initialChats={initialChats as unknown as ChatWithDetails[]}
        initialFriends={initialFriends as unknown as User[]}
        loggedUserId={loggedUser.id}
      />
    </div>
  );
}
