import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-current-user";

export default async function ChatPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // This is a placeholder for the actual Chat UI.
  // Usually, this would render a ChatList or similar component.
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">Select a chat to start messaging</p>
    </div>
  );
}
