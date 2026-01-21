"use server";

/**
 * Server actions for search analytics tracking
 */

import { z } from "zod";
import { createPublicAction } from "@/lib/safe-action";
import { saveSearchEvent } from "@/lib/db/search.repo";

/**
 * Track a search event for analytics
 */
export const trackSearchEvent = createPublicAction(
  z.object({
    userId: z.string().optional(),
    sessionId: z.string().min(1, "Session ID is required"),
    searchQuery: z.string().min(1, "Search query is required"),
    resultCount: z.number().optional(),
    clickedResultIndex: z.number().optional(),
    clickedEntityType: z.enum(["city", "country", "activity"]).optional(),
    pagePath: z.string().optional(),
  }),
  async (data) => {
    // Sanitize input
    const sanitizedData = {
      ...data,
      sessionId: data.sessionId.substring(0, 100), // Limit length
      searchQuery: data.searchQuery.substring(0, 200), // Limit length
      resultCount: Math.max(0, data.resultCount || 0),
      clickedResultIndex:
        data.clickedResultIndex !== undefined
          ? Math.max(0, data.clickedResultIndex)
          : undefined,
      pagePath: data.pagePath?.substring(0, 200),
    } as any; // Cast to any to avoid strict SearchResultType issues with the repo for now

    return await saveSearchEvent(sanitizedData);
  },
);
