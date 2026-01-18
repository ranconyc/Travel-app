import { getActiveVisit, getUserTravelHistory } from "@/lib/db/cityVisit.repo";

/**
 * Get the user's current city visit with full details
 */
export async function getCurrentCityVisit(userId: string) {
  return await getActiveVisit(userId);
}

/**
 * Get user's complete travel history
 */
export async function getTravelHistory(userId: string, limit = 50) {
  return await getUserTravelHistory(userId, {
    limit,
    includeActive: true,
  });
}

/**
 * Get user's past travel history (exclude current visit)
 */
export async function getPastTravelHistory(userId: string, limit = 50) {
  return await getUserTravelHistory(userId, {
    limit,
    includeActive: false,
  });
}
