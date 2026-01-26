import { getAllUsers, getUsersForMatching } from "@/lib/db/user.repo";
import { calculateMatchesBatch } from "@/domain/match/match.service";
import { User } from "@/domain/user/user.schema";

const MATES_PER_PAGE = 20;

export async function getMatesPageData(loggedUser: User, currentPage: number) {
  const offset = (currentPage - 1) * MATES_PER_PAGE;

  // Get all user IDs first (lightweight query)
  const allMatesBase = await getAllUsers();

  // Filter out the logged-in user
  const otherMatesBase = allMatesBase.filter((m) => m.id !== loggedUser.id);

  // Apply pagination
  const paginatedMatesBase = otherMatesBase.slice(
    offset,
    offset + MATES_PER_PAGE,
  );
  const mateIds = paginatedMatesBase.map((m) => m.id);

  // Get full data for matching algorithm (needs profile.persona, profile.languages, currentCity, etc.)
  // Matching requires: profile.persona, profile.languages, profile.birthday, currentCity
  const matesFull = await getUsersForMatching(mateIds, { strategy: "full" });

  // Calculate matches using service with caching
  const matesWithMatch = calculateMatchesBatch(
    loggedUser,
    matesFull as User[],
    "current",
  );

  // Calculate pagination metadata
  const totalMates = otherMatesBase.length;
  const totalPages = Math.ceil(totalMates / MATES_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    matesWithMatch,
    pagination: {
      currentPage,
      totalPages,
      hasNextPage,
      hasPrevPage,
      totalMates,
    },
  };
}
