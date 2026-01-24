import { getSession } from "@/lib/auth/get-current-user";
import { getUserById } from "@/lib/db/user.repo";
import { redirect } from "next/navigation";

export default async function MatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/signin");
  }

  const loggedUser = await getUserById(session.user.id);
  if (!loggedUser) {
    redirect("/signin");
  }

  return <div className="min-h-screen bg-app-bg">{children}</div>;
}
