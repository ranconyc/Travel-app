import { getSession } from "@/lib/auth/get-current-user";
import { getUserProfile } from "@/domain/user/user.queries";
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

  const loggedUser = await getUserProfile(session.user.id);
  if (!loggedUser) {
    redirect("/signin");
  }

  return <div className="min-h-screen bg-app-bg">{children}</div>;
}
