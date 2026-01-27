import { prisma } from "@/lib/db/prisma";
import { Client } from "@googlemaps/google-maps-services-js";
import {
  mapGoogleResultToInterests,
  getGoogleSearchTermsForInterest,
} from "@/lib/utils/mapping.util";
import { slugify } from "@/lib/utils/slugify";

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
   */
  async fetchAndSyncPlaces(cityId: string, interestId: string) {
    if (!API_KEY) throw new Error("Missing GOOGLE_MAPS_API_KEY");

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
    if (searchTerms.length === 0) return { count: 0, synced: [] };

    // 3. Search Google Places (Nearby Search)
    // We combine search terms into a query or run multiple depending on strategy.
    // For cost-efficiency, we use nearbySearch with keyword.
    const syncedIds: string[] = [];

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

      // 4. Sync each result (The Hybrid Sync)
      for (const result of response.data.results) {
        if (!result.place_id || !result.geometry?.location) continue;

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
            googleData: result as any, // Cast to any to satisfy Prisma InputJsonValue
            priceLevel: result.price_level,
            coords: placeCoords as any, // Cast to any for Prisma JSON field
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
            coords: placeCoords as any, // Cast to any for Prisma JSON field
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

    return {
      count: syncedIds.length,
      synced: Array.from(new Set(syncedIds)),
    };
  },
};
