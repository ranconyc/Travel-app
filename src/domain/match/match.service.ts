import { User } from "../user/user.schema";
import { MatchResult } from "./match.schema";
import { calculateMatchScoreBatch } from "./match.queries";

/**
 * Calculates match score
 *
 * @param currentUser - The logged-in user
 * @param targetUser - The user to match against
 * @param mode - Matching mode ('current' or 'travel')
 * @returns MatchResult with score and breakdown
 */
export function calculateMatchScore(
  currentUser: User,
  targetUser: User,
  mode: "current" | "travel" = "current",
): MatchResult {
  // Calculate match directly without server-side caching
  return calculateMatchScoreBatch(currentUser, targetUser, mode);
}

/**
 * Calculates match scores for multiple users
 *
 * @param currentUser - The logged-in user
 * @param targetUsers - Array of users to match against
 * @param mode - Matching mode ('current' or 'travel')
 * @returns Array of users with match results
 */
export function calculateMatchesBatch(
  currentUser: User,
  targetUsers: User[],
  mode: "current" | "travel" = "current",
): Array<User & { match: MatchResult }> {
  return targetUsers.map((targetUser) => {
    const match = calculateMatchScore(currentUser, targetUser, mode);
    return {
      ...targetUser,
      match,
    };
  });
}
