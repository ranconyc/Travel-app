/**
 * Server actions for search analytics tracking
 */

"use server";

import { saveSearchEvent } from "@/lib/db/search.repo";
import { SearchEventData } from "@/types/search";

/**
 * Track a search event for analytics
 */
export async function trackSearchEvent(data: SearchEventData) {
  try {
    // Validate required fields
    if (!data.sessionId || !data.searchQuery) {
      return {
        success: false,
        error: "Missing required fields: sessionId and searchQuery",
      };
    }

    // Sanitize input
    const sanitizedData: SearchEventData = {
      userId: data.userId,
      sessionId: data.sessionId.substring(0, 100), // Limit length
      searchQuery: data.searchQuery.substring(0, 200), // Limit length
      resultCount: Math.max(0, data.resultCount || 0),
      clickedResultIndex:
        data.clickedResultIndex !== undefined
          ? Math.max(0, data.clickedResultIndex)
          : undefined,
      clickedEntityType: data.clickedEntityType,
      pagePath: data.pagePath?.substring(0, 200),
    };

    const result = await saveSearchEvent(sanitizedData);
    return result;
  } catch (error) {
    console.error("Failed to track search event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
