import { User } from "../user/user.schema";
import { MatchResult } from "./match.schema";
import { calculateMatchScoreBatch } from "./match.queries";

/**
 * Simple in-memory cache for match scores
 * Key format: `${currentUserId}-${targetUserId}-${mode}`
 */
const matchCache = new Map<string, { result: MatchResult; timestamp: number }>();

/**
 * Cache TTL in milliseconds (5 minutes)
 */
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Cleans up expired cache entries
 */
function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of matchCache.entries()) {
    if (now - value.timestamp > CACHE_TTL_MS) {
      matchCache.delete(key);
    }
  }
}

/**
 * Gets cached match result if available and not expired
 */
function getCachedMatch(
  currentUserId: string,
  targetUserId: string,
  mode: "current" | "travel",
): MatchResult | null {
  const cacheKey = `${currentUserId}-${targetUserId}-${mode}`;
  const cached = matchCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.result;
  }

  // Clean up expired entry
  if (cached) {
    matchCache.delete(cacheKey);
  }

  return null;
}

/**
 * Caches a match result
 */
function setCachedMatch(
  currentUserId: string,
  targetUserId: string,
  mode: "current" | "travel",
  result: MatchResult,
) {
  const cacheKey = `${currentUserId}-${targetUserId}-${mode}`;
  matchCache.set(cacheKey, {
    result,
    timestamp: Date.now(),
  });

  // Periodic cleanup (every 100 cache operations)
  if (matchCache.size % 100 === 0) {
    cleanupCache();
  }
}

/**
 * Calculates match score with caching
 * 
 * @param currentUser - The logged-in user
 * @param targetUser - The user to match against
 * @param mode - Matching mode ('current' or 'travel')
 * @returns MatchResult with score and breakdown
 */
export function calculateMatchWithCache(
  currentUser: User,
  targetUser: User,
  mode: "current" | "travel" = "current",
): MatchResult {
  // Check cache first
  const cached = getCachedMatch(currentUser.id, targetUser.id, mode);
  if (cached) {
    return cached;
  }

  // Calculate match
  const result = calculateMatchScoreBatch(currentUser, targetUser, mode);

  // Cache the result
  setCachedMatch(currentUser.id, targetUser.id, mode, result);

  return result;
}

/**
 * Calculates match scores for multiple users with caching
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
    const match = calculateMatchWithCache(currentUser, targetUser, mode);
    return {
      ...targetUser,
      match,
    };
  });
}

/**
 * Clears the match cache (useful for testing or when user data changes)
 */
export function clearMatchCache() {
  matchCache.clear();
}

/**
 * Gets cache statistics (for monitoring)
 */
export function getMatchCacheStats() {
  return {
    size: matchCache.size,
    keys: Array.from(matchCache.keys()),
  };
}
