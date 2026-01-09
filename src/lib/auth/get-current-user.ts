import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/db/user.repo";
import { cache } from "react";

/**
 * Validates the current session and fetches the logged-in user.
 * Uses React `cache` to deduplicate requests, so safe to call in Layouts and Pages simultaneously.
 */
export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const user = await getUserById(session.user.id);
  return user;
};
