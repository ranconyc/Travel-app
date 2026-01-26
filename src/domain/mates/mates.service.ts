import { getPaginatedUsers, getUsersForMatching } from "@/lib/db/user.repo";
import { calculateMatchesBatch } from "@/domain/match/match.service";
import { User } from "@/domain/user/user.schema";

const MATES_PER_PAGE = 20;

export async function getMatesPageData(loggedUser: User, currentPage: number) {
  const skip = (currentPage - 1) * MATES_PER_PAGE;

  // 1. Fetch Paginated Users (Global approach first for simplicity,
  // as 100km radius with 100 users might often be empty)
  const usersBase = await getPaginatedUsers({
    take: MATES_PER_PAGE,
    skip,
    excludeUserId: loggedUser.id,
  });

  if (usersBase.length === 0) {
    return {
      matesWithMatch: [],
      pagination: {
        currentPage,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: currentPage > 1,
        totalMates: 0,
      },
      meta: { isGlobal: true },
    };
  }

  const mateIds = usersBase.map((u) => u.id);

  // 2. Get full data for matching
  const matesFull = await getUsersForMatching(mateIds, { strategy: "full" });

  // 3. Calculate matches
  const matesWithMatch = calculateMatchesBatch(
    loggedUser,
    matesFull as User[],
    "current",
  );

  // Note: For a real launch, we'd need a separate count query for accurate pagination
  // But for 100 users, we can estimate or use a high fixed count.
  // I'll keep it simple for now as requested.

  return {
    matesWithMatch,
    pagination: {
      currentPage,
      totalPages: 5, // Placeholder for 100 users / 20 per page
      hasNextPage: matesWithMatch.length === MATES_PER_PAGE,
      hasPrevPage: currentPage > 1,
      totalMates: 100, // Approximate
    },
    meta: {
      isGlobal: true, // We'll expand this later to tiered logic
    },
  };
}
