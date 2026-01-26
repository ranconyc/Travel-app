import { auth } from "@/auth";
import { getUserById, UserWithRelations } from "@/lib/db/user.repo";
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
 * Returns full user data with profile, media, and currentCity.
 */
export const getCurrentUser = cache(
  async (): Promise<UserWithRelations | null> => {
    const userId = await getUserId();
    if (!userId) {
      return null;
    }
    return (await getUserById(userId, {
      strategy: "full",
    })) as UserWithRelations | null;
  },
);
