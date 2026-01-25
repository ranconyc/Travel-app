import { getSession } from "@/lib/auth/get-current-user";
import { getAllUsers, getUserById, getUsersForMatching } from "@/lib/db/user.repo";
import { redirect } from "next/navigation";
import { calculateMatchesBatch } from "@/domain/match/match.service";
import NearbyMatesClient from "./components/NearbyMatesClient";

const MATES_PER_PAGE = 20;

export default async function NearbyMatesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getSession();
  const loggedUser = await getUserById(session?.user?.id || "", {
    strategy: "full",
  });

  if (!loggedUser) {
    redirect("/signin");
  }

  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const offset = (currentPage - 1) * MATES_PER_PAGE;

  // Get all user IDs first (lightweight query)
  const allMatesBase = await getAllUsers();
  
  // Filter out the logged-in user
  const otherMatesBase = allMatesBase.filter((m) => m.id !== loggedUser.id);
  
  // Apply pagination
  const paginatedMatesBase = otherMatesBase.slice(offset, offset + MATES_PER_PAGE);
  const mateIds = paginatedMatesBase.map((m) => m.id);
  
  // Get full data for matching algorithm (needs profile.persona, profile.languages, currentCity, etc.)
  // Matching requires: profile.persona, profile.languages, profile.birthday, currentCity
  const matesFull = await getUsersForMatching(mateIds, { strategy: "full" });
  
  // Calculate matches using service with caching
  const matesWithMatch = calculateMatchesBatch(loggedUser, matesFull, "current");

  // Calculate pagination metadata
  const totalMates = otherMatesBase.length;
  const totalPages = Math.ceil(totalMates / MATES_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <div>
      <NearbyMatesClient
        mates={matesWithMatch}
        loggedUser={loggedUser}
        pagination={{
          currentPage,
          totalPages,
          hasNextPage,
          hasPrevPage,
          totalMates,
        }}
      />
    </div>
  );
}
