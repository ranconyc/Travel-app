import { getTravelPartnersAction } from "@/domain/friendship/friendship.actions";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { redirect } from "next/navigation";
import { getUserChats } from "@/domain/chat/chat.actions";
import { ChatSearchClient } from "./_components/ChatSearchClient";

export default async function ChatPage() {
  const loggedUser = await getCurrentUser();

  if (!loggedUser) {
    redirect("/signin");
  }

  const [friendsResponse, chatsResponse] = await Promise.all([
    getTravelPartnersAction(loggedUser.id),
    getUserChats(loggedUser.id),
  ]);

  const initialFriends = friendsResponse.success ? friendsResponse.data : [];
  const initialChats = chatsResponse.success ? chatsResponse.data : [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ChatSearchClient
        initialChats={initialChats}
        initialFriends={initialFriends}
        loggedUserId={loggedUser.id}
      />
    </div>
  );
}
