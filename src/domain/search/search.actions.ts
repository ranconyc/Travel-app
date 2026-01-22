"use server";

/**
 * Server actions for search analytics tracking
 */

import { z } from "zod";
import { createPublicAction } from "@/lib/safe-action";
import { handleTrackSearchEvent } from "./search.service";

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
    return await handleTrackSearchEvent(data);
  },
);
