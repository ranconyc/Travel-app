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

  const user: User = {
    ...rawUser,
    id: rawUser.id ?? "",
    createdAt: rawUser.createdAt ?? new Date(),
    updatedAt: rawUser.updatedAt ?? new Date(),
    name: rawUser.name ?? null,
    role: rawUser.role ?? "USER",
  };
  console.log("user", user);

  return <CompleteProfileShell user={user} />;
}
