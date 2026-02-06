import {
  getPaginatedUsers,
  getUsersForMatching,
  countActiveUsers,
} from "@/lib/db/user.repo";
import { calculateMatchesBatch } from "@/domain/match/match.service";
import { User } from "@/domain/user/user.schema";

const MATES_PER_PAGE = 20;

export async function getMatesPageData(loggedUser: User, currentPage: number) {
  const skip = (currentPage - 1) * MATES_PER_PAGE;

  // 1. Get total count for accurate pagination
  const totalMates = await countActiveUsers(loggedUser.id);

  // 2. Fetch Paginated Users (Global approach - show all users worldwide)
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
        totalPages: Math.ceil(totalMates / MATES_PER_PAGE),
        hasNextPage: false,
        hasPrevPage: currentPage > 1,
        totalMates,
      },
      meta: { isGlobal: true },
    };
  }

  const mateIds = usersBase.map((u) => u.id);

  // 3. Get full data for matching
  const matesFull = await getUsersForMatching(mateIds, { strategy: "full" });

  // 4. Calculate matches
  const matesWithMatch = calculateMatchesBatch(
    loggedUser,
    matesFull as User[],
    "current",
  );

  const totalPages = Math.ceil(totalMates / MATES_PER_PAGE);

  return {
    matesWithMatch,
    pagination: {
      currentPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      totalMates,
    },
    meta: {
      isGlobal: true, // Always global for early-stage app
    },
  };
}
