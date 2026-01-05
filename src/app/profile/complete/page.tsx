import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/db/user.repo";
import CompleteProfileShell from "./CompleteProfileShell";

export default async function CompleteProfilePage() {
  const session = await getServerSession(authOptions);

  const user = await getUserById(session?.user?.id as string);

  return <CompleteProfileShell user={user} />;
}
