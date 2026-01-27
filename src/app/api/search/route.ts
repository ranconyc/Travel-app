/**
 * Unified search API endpoint
 * GET /api/search?q=query&userId=optional
 */

import { NextRequest, NextResponse } from "next/server";
import {
  searchCities,
  searchCountries,
  searchActivities,
} from "@/lib/db/search.repo";
import { SearchResponse, SearchResult } from "@/types/search";
import { filterAndSortPlaces } from "@/services/discovery/enhanced-matching.service";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getDistanceMetadata } from "@/domain/shared/utils/geo";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    // Return empty results for queries that are too short
    if (!query || query.length < 2) {
      return NextResponse.json<SearchResponse>({
        results: [],
        totalCount: 0,
      });
    }

    // Get current user for personalized search
    const user = await getCurrentUser();
    
    // Search across all entity types in parallel
    const [cities, countries, activities] = await Promise.all([
      searchCities(query),
      searchCountries(query),
      searchActivities(query),
    ]);

    // If user is logged in, enhance place search with match scores
    let enhancedActivities = activities;
    if (user && (user as any).persona) {
      try {
        // Get all places that match the search
        const allPlaces = await prisma.place.findMany({
          where: {
            isPermanentlyClosed: false,
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { tags: { hasSome: [query] } },
              { address: { contains: query, mode: 'insensitive' } },
            ]
          },
          take: 50 // Get more places for better matching
        });

        // Filter and sort based on user preferences
        const userPersona = {
          interests: (user as any).persona.interests || [],
          budget: (user as any).persona.budget || 'moderate',
          travelStyle: (user as any).persona.travelStyle || []
        };

        // Use user's current location or default to first place's location
        const userLocation = (user as any).currentLocation || 
          (allPlaces.length > 0 ? allPlaces[0].coords : null);

        const matchedPlaces = filterAndSortPlaces(
          allPlaces as any[],
          userPersona,
          { limit: 50 }
        );

        // Convert enhanced places back to SearchResult format
        enhancedActivities = matchedPlaces.map((item, index) => ({
          id: `place-${item.place.id}`,
          label: item.place.name,
          subtitle: item.place.address || '',
          type: 'activity' as const,
          entityId: item.place.id || '',
          meta: {
            activityType: 'place',
            matchScore: index < 5 ? 100 - index * 10 : undefined, // Top 5 get high scores
            rating: item.place.rating,
            priceLevel: item.place.priceLevel,
            tags: item.place.tags,
            distance: userLocation && item.place.coords ? 
              getDistanceMetadata(userLocation, item.place.coords)?.distanceStr : undefined,
          },
        }));
      } catch (error) {
        console.error("Error enhancing search with match scores:", error);
        // Fall back to original activities if enhancement fails
      }
    }

    // Combine results with cities first, then countries, and enhanced activities
    const allResults: SearchResult[] = [...cities, ...countries, ...enhancedActivities];

    // Sort results: prioritize places with high match scores
    const sortedResults = allResults.sort((a, b) => {
      // If both have match scores, sort by score (higher first)
      const aScore = a.type === 'activity' ? (a.meta?.matchScore as number) : undefined;
      const bScore = b.type === 'activity' ? (b.meta?.matchScore as number) : undefined;
      
      if (aScore !== undefined && bScore !== undefined) {
        return bScore - aScore;
      }
      
      // If only one has a match score, prioritize it
      if (aScore !== undefined) return -1;
      if (bScore !== undefined) return 1;
      
      // Otherwise, maintain original order (cities, countries, activities)
      return 0;
    });

    // Limit total results to 15
    const MAX_TOTAL_RESULTS = 15;
    const limitedResults = sortedResults.slice(0, MAX_TOTAL_RESULTS);

    return NextResponse.json<SearchResponse>({
      results: limitedResults,
      totalCount: limitedResults.length,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json<SearchResponse>(
      {
        results: [],
        totalCount: 0,
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate distance between two points
function calculateDistance(point1: any, point2: any): number {
  if (!point1?.coordinates || !point2?.coordinates) return 0;
  
  const [lng1, lat1] = point1.coordinates;
  const [lng2, lat2] = point2.coordinates;
  
  // Haversine formula (simplified)
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c;
}
