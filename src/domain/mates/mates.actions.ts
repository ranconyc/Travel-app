"use server";

import { createSafeAction } from "@/lib/safe-action";
import { GetMatesSchema } from "./mates.schema";
import { getMatesPageData } from "./mates.service";
import { getUserById } from "@/lib/db/user.repo";
import { User } from "@/domain/user/user.schema";

export const getMatesAction = createSafeAction(
  GetMatesSchema,
  async ({ page }, userId) => {
    // 1. Get the current user
    const loggedUser = (await getUserById(userId, {
      strategy: "full",
    })) as User | null;

    if (!loggedUser) {
      throw new Error("Unauthorized");
    }

    // 2. Fetch mates with matches
    return await getMatesPageData(loggedUser, page);
  },
);
