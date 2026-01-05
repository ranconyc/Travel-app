"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// This is the expected shape of the React Hook Form submission
export type TravelPreferencesFormValues = {
  preferences: Record<string, string[]>;
};

export async function saveTravelPreferences(data: TravelPreferencesFormValues) {
  // 1) Validate user session
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const userId = session.user.id as string;

  // 2) Flatten preferences object into a list of interest slugs
  // Example: { shopping: ["local_markets"], food: ["street_food"] }
  // => ["local_markets", "street_food"]
  const preferences = data.preferences ?? {};
  const interestSlugs = Array.from(new Set(Object.values(preferences).flat()));

  // 3) If user cleared all interests, simply remove all records
  if (interestSlugs.length === 0) {
    await prisma.userInterest.deleteMany({
      where: { userId },
    });

    return { ok: true, removedAll: true, created: 0 };
  }

  // 4) Fetch all matching interests from the DB by slug
  const interests = await prisma.interest.findMany({
    where: { slug: { in: interestSlugs } },
    select: { id: true, slug: true },
  });

  if (interests.length === 0) {
    // No interests matched → clear all
    await prisma.userInterest.deleteMany({
      where: { userId },
    });
    return { ok: true, removedAll: true, created: 0 };
  }

  // 5) Extract interest IDs
  const interestIds = interests.map((i) => i.id);

  // 6) Update user preferences using a transaction:
  //    - Remove old relations
  //    - Insert new user-interest relations
  const result = await prisma.$transaction(async (tx) => {
    // Remove existing user-interest relations
    await tx.userInterest.deleteMany({ where: { userId } });

    // Insert new user-interest relations
    const createResult = await tx.userInterest.createMany({
      data: interestIds.map((interestId) => ({
        userId,
        interestId,
        weight: 1, // Can be extended in future for scoring
      })),
      skipDuplicates: true,
    });

    return { createdCount: createResult.count };
  });

  return {
    ok: true,
    created: result.createdCount,
    interestIds,
  };
}
