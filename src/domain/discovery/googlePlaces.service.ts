import { prisma } from "@/lib/db/prisma";
import { Client } from "@googlemaps/google-maps-services-js";
import {
  mapGoogleResultToInterests,
  getGoogleSearchTermsForInterest,
} from "@/lib/utils/mapping.util";
import { slugify } from "@/lib/utils/slugify";
import { apiLockService } from "@/services/api-lock.service";

const client = new Client({});
const API_KEY =
  process.env.GOOGLE_PLACES_API_KEY ||
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  "";

/**
 * Service to fetch and sync places from Google Maps to our DB.
 */
export const GooglePlacesService = {
  /**
   * Fetches and syncs places for a specific city and interest.
   * Implements lock mechanism to prevent duplicate API calls.
   */
  async fetchAndSyncPlaces(cityId: string, interestId: string) {
    if (!API_KEY) throw new Error("Missing GOOGLE_MAPS_API_KEY");

    // Create lock key for this specific sync operation
    const lockKey = `sync:${cityId}:${interestId}`;
    
    // Check if recently synced (within 24 hours)
    if (apiLockService.wasRecentlySynced(lockKey)) {
      console.log(`🔒 Skipping sync for ${cityId}:${interestId} - recently synced`);
      return { count: 0, synced: [], cached: true };
    }

    // Acquire lock to prevent concurrent syncs
    if (!apiLockService.acquireLock(lockKey)) {
      console.log(`🔒 Sync already in progress for ${cityId}:${interestId}`);
      return { count: 0, synced: [], locked: true };
    }

    try {
      console.log(`🚀 Starting sync for ${cityId}:${interestId}`);

      // 1. Get City data (coordinates)
      const city = await prisma.city.findUnique({
        where: { cityId },
      });

      if (!city) throw new Error(`City not found: ${cityId}`);

      const coords = city.coords as any;
      if (!coords || !coords.coordinates)
        throw new Error("City missing coordinates");

      const [lng, lat] = coords.coordinates;

      // 2. Get search terms from interest
      const searchTerms = getGoogleSearchTermsForInterest(interestId);
      if (searchTerms.length === 0) {
        apiLockService.releaseLock(lockKey, { count: 0, synced: [] });
        return { count: 0, synced: [] };
      }

      // 3. Check if we already have sufficient data for this city/interest
      const existingPlacesCount = await prisma.place.count({
        where: {
          cityRefId: city.id,
          tags: { has: interestId },
          updatedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Updated in last 7 days
          }
        }
      });

      // If we have enough recent places, skip API call
      if (existingPlacesCount >= 20) {
        console.log(`📊 Sufficient recent data exists for ${cityId}:${interestId} (${existingPlacesCount} places)`);
        apiLockService.markAsSynced(lockKey);
        return { count: existingPlacesCount, synced: [], cached: true };
      }

      // 4. Search Google Places (Nearby Search)
      const syncedIds: string[] = [];
      const seenPlaceIds = new Set<string>(); // Prevent duplicates

      for (const keyword of searchTerms) {
        const response = await client.placesNearby({
          params: {
            location: [lat, lng],
            radius: 5000, // 5km radius
            keyword,
            key: API_KEY,
          },
        });

        if (!response.data.results) continue;

        // 5. Sync each result (The Hybrid Sync)
        for (const result of response.data.results) {
          if (!result.place_id || !result.geometry?.location) continue;
          
          // Skip if we've already processed this place
          if (seenPlaceIds.has(result.place_id)) continue;
          seenPlaceIds.add(result.place_id);

          const interests = mapGoogleResultToInterests({
            place_id: result.place_id,
            name: result.name || "",
            types: result.types || [],
          });

          // Ensure current interestId is included
          if (!interests.includes(interestId)) {
            interests.push(interestId);
          }

          const slug = slugify(`${result.name}-${result.place_id.slice(-5)}`);

          // Prepare GeoJSON Point
          const placeCoords = {
            type: "Point",
            coordinates: [
              result.geometry.location.lng,
              result.geometry.location.lat,
            ],
          };

          await prisma.place.upsert({
            where: { googlePlaceId: result.place_id },
            update: {
              tags: { set: interests },
              googleData: result as any,
              priceLevel: result.price_level,
              coords: placeCoords as any,
              updatedAt: new Date(), // Update timestamp
            },
            create: {
              slug,
              name: result.name || "Unknown Place",
              googlePlaceId: result.place_id,
              cityRefId: city.id,
              countryRefId: city.countryRefId,
              type: result.types?.[0]?.toUpperCase() || "ESTABLISHMENT",
              categories: result.types || [],
              address: result.vicinity,
              coords: placeCoords as any,
              rating: result.rating || 0,
              reviewCount: result.user_ratings_total || 0,
              priceLevel: result.price_level,
              googleData: result as any,
              tags: interests,
              autoCreated: true,
              needsReview: true,
            },
          });

          syncedIds.push(result.place_id);
        }
      }

      // Mark as synced with 24-hour TTL
      apiLockService.markAsSynced(lockKey);

      const result = {
        count: syncedIds.length,
        synced: Array.from(new Set(syncedIds)),
      };

      console.log(`✅ Sync completed for ${cityId}:${interestId} - ${result.count} places`);
      
      return result;

    } catch (error) {
      console.error(`❌ Sync failed for ${cityId}:${interestId}:`, error);
      // Release lock on error so retry is possible
      apiLockService.releaseLock(lockKey);
      throw error;
    }
  },

  /**
   * Get sync status for a city/interest combination
   */
  getSyncStatus(cityId: string, interestId: string): {
    recentlySynced: boolean;
    inProgress: boolean;
    lastSync?: Date;
  } {
    const lockKey = `sync:${cityId}:${interestId}`;
    const lock = (apiLockService as any).locks.get(lockKey);
    
    return {
      recentlySynced: apiLockService.wasRecentlySynced(lockKey),
      inProgress: apiLockService.isLocked(lockKey),
      lastSync: lock ? new Date(lock.timestamp) : undefined
    };
  },

  /**
   * Get API lock statistics
   */
  getLockStats() {
    return apiLockService.getStats();
  }
};
