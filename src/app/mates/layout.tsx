import { getCurrentUser } from "@/lib/auth/get-current-user";
import { redirect } from "next/navigation";

export default async function MatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedUser = await getCurrentUser();
  if (!loggedUser) {
    redirect("/signin");
  }

  return <div className="min-h-screen bg-main">{children}</div>;
}
