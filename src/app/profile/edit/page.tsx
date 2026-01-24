import { getSession } from "@/lib/auth/get-current-user";
import { getUserById } from "@/lib/db/user.repo";
import CompleteProfileShell from "@/app/profile/edit/CompleteProfileShell";
import { User } from "@/domain/user/user.schema";

export default async function CompleteProfilePage() {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User ID is undefined");
  }

  const rawUser = await getUserById(userId);
  if (!rawUser) {
    throw new Error("User not found");
  }

  // getUserById already returns properly typed user, cast directly
  const user = rawUser as User;
  console.log("user", user);

  return <CompleteProfileShell user={user} />;
}
