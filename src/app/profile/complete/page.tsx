import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserById } from "@/lib/db/user.repo";
import CompleteProfileShell from "./CompleteProfileShell";

export default async function CompleteProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const user = await getUserById(session.user.id as string);

  if (!user) {
    redirect("/");
  }

  return <CompleteProfileShell user={user} />;
}
