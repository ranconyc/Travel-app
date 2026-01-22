import { getTravelPartnersAction } from "@/domain/friendship/friendship.actions";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { redirect } from "next/navigation";
import { FriendChatStarter } from "./_components/FriendChatStarter";
import Input from "../components/form/Input";

const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <header className="p-4 pt-8">
      <p className="text-primery text-lg">{subtitle}</p>
      <h1 className="text-3xl font-bold capitalize mb-6 min-h-[40px] flex items-center">
        {title}
      </h1>
      <Input type="search" className="w-full" placeholder="Search chats..." />
    </header>
  );
};

export default async function ChatPage() {
  const loggedUser = await getCurrentUser();

  if (!loggedUser) {
    redirect("/signin");
  }

  const response = await getTravelPartnersAction(loggedUser.id);
  const friends = response.success ? response.data : [];

  return (
    <div>
      <Header title="Chats" subtitle="Your" />
      <main className="p-4 flex flex-col items-center justify-center">
        <div className="w-72 mt-44">
          <h2 className="font-bold text-2xl">It’s a bit quiet in here...</h2>
          <p className="text-muted-foreground">
            Don't be shy! Reach out to one of your mates below and break the ice
          </p>
        </div>
        <div className="mt-8 flex gap-4 overflow-x-auto pb-4">
          {friends.map((friend) => (
            <FriendChatStarter
              key={friend.id}
              friendId={friend.id}
              friendName={`${friend.firstName} ${friend.lastName}`}
              friendImage={friend.profilePicture}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
