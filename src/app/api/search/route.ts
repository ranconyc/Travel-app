/**
 * Unified search API endpoint
 * GET /api/search?q=query&userId=optional
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  searchCities,
  searchCountries,
  searchActivities,
} from "@/lib/db/search.repo";
import { SearchResponse, SearchResult } from "@/types/search";
import {
  filterAndSortPlaces,
  type EnhancedMatchResult,
} from "@/domain/discovery/services/enhanced-matching.service";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getDistanceMetadata } from "@/domain/shared/utils/geo";

const GeoPointSchema = z.object({
  type: z.string(),
  coordinates: z.tuple([z.number(), z.number()]),
});

type GeoPoint = z.infer<typeof GeoPointSchema>;

const PersonaForMatchingSchema = z
  .object({
    interests: z.array(z.string()).default([]),
    budget: z.string().nullable().optional(),
    travelStyle: z.array(z.string()).default([]),
  })
  .passthrough();

function toLatLng(point: GeoPoint | null): { lat: number; lng: number } | null {
  if (!point) return null;
  return {
    lng: point.coordinates[0],
    lat: point.coordinates[1],
  };
}

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
    const personaRaw = user?.profile?.persona;
    if (user && personaRaw) {
      try {
        const parsedPersona = PersonaForMatchingSchema.safeParse(personaRaw);
        if (!parsedPersona.success) {
          throw new Error("Invalid persona payload");
        }

        const userPersona = {
          interests: parsedPersona.data.interests,
          budget: parsedPersona.data.budget ?? undefined,
          travelStyle: parsedPersona.data.travelStyle,
        };

        const userLocationPoint = GeoPointSchema.safeParse(user.currentLocation)
          .success
          ? (GeoPointSchema.parse(user.currentLocation) as GeoPoint)
          : null;

        const userLatLng = toLatLng(userLocationPoint);

        // Get all places that match the search
        const allPlaces = await prisma.place.findMany({
          where: {
            isPermanentlyClosed: false,
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { tags: { hasSome: [query] } },
              { address: { contains: query, mode: "insensitive" } },
            ],
          },
          select: {
            id: true,
            name: true,
            address: true,
            rating: true,
            priceLevel: true,
            tags: true,
            coords: true,
            vibeScores: true,
          },
          take: 50, // Get more places for better matching
        });

        const normalizedPlaces = allPlaces.map((p) => ({
          ...p,
          tags: Array.isArray(p.tags) ? p.tags : [],
        }));

        const matchedPlaces = filterAndSortPlaces(
          normalizedPlaces,
          userPersona,
          {
            limit: 50,
          },
        );

        enhancedActivities = matchedPlaces.map(
          (item: {
            place: (typeof normalizedPlaces)[number];
            matchResult: EnhancedMatchResult;
          }) => {
            const { place, matchResult } = item;
            const placePoint = GeoPointSchema.safeParse(place.coords).success
              ? (GeoPointSchema.parse(place.coords) as GeoPoint)
              : null;

            const placeLatLng = toLatLng(placePoint);
            const distanceMeta =
              userLatLng && placeLatLng
                ? getDistanceMetadata(userLatLng, placeLatLng)
                : null;

            return {
              id: `place-${place.id}`,
              label: place.name,
              subtitle: place.address || "",
              type: "activity" as const,
              entityId: place.id,
              meta: {
                activityType: "place",
                matchScore: matchResult.finalScore,
                rating: place.rating,
                priceLevel: place.priceLevel,
                tags: place.tags,
                distance: distanceMeta?.distanceStr,
              },
            };
          },
        );
      } catch (error) {
        console.error("Error enhancing search with match scores:", error);
        // Fall back to original activities if enhancement fails
      }
    }

    // Combine results with cities first, then countries, and enhanced activities
    const allResults: SearchResult[] = [
      ...cities,
      ...countries,
      ...enhancedActivities,
    ];

    // Sort results: prioritize places with high match scores
    const sortedResults = allResults.sort((a, b) => {
      // If both have match scores, sort by score (higher first)
      const aScore =
        a.type === "activity" ? (a.meta?.matchScore as number) : undefined;
      const bScore =
        b.type === "activity" ? (b.meta?.matchScore as number) : undefined;

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
      { status: 500 },
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
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
