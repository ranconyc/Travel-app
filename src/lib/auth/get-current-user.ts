import { auth } from "@/auth";
import { getUserById } from "@/lib/db/user.repo";
import { cache } from "react";

/**
 * Get the current session without fetching user from DB.
 */
export const getSession = cache(async () => {
  return await auth();
});

/**
 * Get the current user ID if it exists.
 */
export const getUserId = cache(async () => {
  const session = await getSession();
  return session?.user?.id ?? null;
});

/**
 * Get the full user object from the DB.
 * Cached to deduplicate DB calls across the server tree.
 */
export const getCurrentUser = cache(async () => {
  const userId = await getUserId();
  if (!userId) {
    return null;
  }
  return await getUserById(userId);
});
