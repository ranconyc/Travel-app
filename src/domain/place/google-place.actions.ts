"use server";

import { createAdminAction } from "@/lib/safe-action";
import { z } from "zod";
import { findNearbyCities } from "@/lib/db/cityLocation.repo";
import { apiLockService } from "@/lib/services/api-lock.service";

/**
 * Search Google Places by text query or URL
 */
export const searchGooglePlaceAction = createAdminAction(
  z.object({
    query: z.string().min(3),
  }),
  async ({ query }) => {
    // Check if query looks like a Google Maps URL, extract coords or place ID if possible
    // For now, we will treat it as a text search which handles names and addresses well.
    // Enhanced URL handling can be added later (e.g. extracting !1s... CID).

    // Clean query
    const cleanQuery = query.trim();

    // Check cache/lock
    const cacheKey = `places-search:${cleanQuery.toLowerCase()}`;
    const cachedResult = apiLockService.getCachedResult(cacheKey);
    if (cachedResult) return cachedResult;

    if (!apiLockService.acquireLock(cacheKey)) {
      throw new Error("Search in progress");
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        cleanQuery,
      )}&key=${process.env.GOOGLE_PLACES_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      apiLockService.releaseLock(cacheKey, data.results);
      return data.results;
    } catch (error) {
      apiLockService.releaseLock(cacheKey);
      throw error;
    }
  },
);

/**
 * Fetch detailed place info including hours and website
 */
export const fetchGooglePlaceDetailsAction = createAdminAction(
  z.object({
    placeId: z.string(),
  }),
  async ({ placeId }) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,website,international_phone_number,opening_hours,price_level,rating,user_ratings_total,photos,place_id,utc_offset,types,business_status,reviews&key=${process.env.GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(data.error_message || "Failed to fetch place details");
    }
    return data.result;
  },
);

/**
 * Find the nearest city for a given lat/lng
 */
export const resolveLocationAction = createAdminAction(
  z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  async ({ lat, lng }) => {
    // Use the repo function to find cities within 50km
    const cities = await findNearbyCities(lng, lat, 50, 5);

    if (cities.length === 0) return null;

    // Return the closest one
    return cities[0];
  },
);

/**
 * Background function to refresh place data if stale
 * Intended to be called without awaiting in server components
 */
export const refreshPlaceData = async (
  placeId: string,
  googlePlaceId: string,
) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${googlePlaceId}&fields=name,formatted_address,website,international_phone_number,opening_hours,price_level,rating,user_ratings_total,photos,place_id,types&key=${process.env.GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" || !data.result) {
      console.error(`Failed to refresh place ${placeId}:`, data.error_message);
      return;
    }

    const details = data.result;

    // Update DB
    // We import updatePlace from repo to avoid circular deps if possible, or use prisma directly
    // Using prisma directly here for speed/simplicity in background task
    const { prisma } = await import("@/lib/db/prisma");

    await prisma.place.update({
      where: { id: placeId },
      data: {
        // Only update fields that should be synced
        rating: details.rating || undefined,
        reviewCount: details.user_ratings_total || undefined,
        priceLevel: details.price_level || undefined,
        websiteUrl: details.website || undefined,
        phoneNumber: details.international_phone_number || undefined,
        lastGoogleSync: new Date(),
      },
    });

    console.log(`Refreshed place data for ${placeId}`);
  } catch (error) {
    console.error(`Error refreshing place ${placeId}:`, error);
  }
};
