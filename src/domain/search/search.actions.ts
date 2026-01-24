"use server";

import { z } from "zod";
import { createPublicAction } from "@/lib/safe-action";
import {
  handleTrackSearchEvent,
  handleSearchDestinations,
  handleSearchExternalDestinations,
  handleSaveExternalDestination,
} from "./search.service";
import { SearchDestinationsSchema, TrackSearchSchema } from "./search.schema";

/**
 * Perform a global search for destinations
 */
export const searchDestinationsAction = createPublicAction(
  SearchDestinationsSchema,
  async ({ query }) => {
    return await handleSearchDestinations(query);
  },
);

/**
 * Perform an external search for destinations (fallback)
 */
export const searchExternalDestinationsAction = createPublicAction(
  SearchDestinationsSchema,
  async ({ query }) => {
    return await handleSearchExternalDestinations(query);
  },
);

/**
 * Save an externally found destination
 */
export const saveExternalDestinationAction = createPublicAction(
  z.object({
    externalItem: z.any(),
  }),
  async ({ externalItem }) => {
    return await handleSaveExternalDestination(externalItem);
  },
);

/**
 * Track a search event for analytics
 */
export const trackSearchEvent = createPublicAction(
  TrackSearchSchema,
  async (data) => {
    return await handleTrackSearchEvent(data);
  },
);
