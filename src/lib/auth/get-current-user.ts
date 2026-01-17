import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/db/user.repo";
import { cache } from "react";

// Wrap the function to deduplicate DB calls across the server tree
export const getCurrentUser = cache(async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const user = await getUserById(session.user.id);
  return user;
});
