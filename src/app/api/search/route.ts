/**
 * Unified search API endpoint
 * GET /api/search?q=query&userId=optional
 */

import { NextRequest, NextResponse } from "next/server";
import {
  searchCities,
  searchCountries,
  searchActivities,
  searchTrips,
} from "@/lib/db/search.repo";
import { SearchResponse, SearchResult } from "@/types/search";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";
    const userId = searchParams.get("userId") || undefined;

    // Return empty results for queries that are too short
    if (!query || query.length < 2) {
      return NextResponse.json<SearchResponse>({
        results: [],
        totalCount: 0,
      });
    }

    // Search across all entity types in parallel
    const [cities, countries, activities, trips] = await Promise.all([
      searchCities(query),
      searchCountries(query),
      searchActivities(query),
      searchTrips(query, userId),
    ]);

    // Combine results with cities first, then countries, activities, and trips
    const allResults: SearchResult[] = [
      ...cities,
      ...countries,
      ...activities,
      ...trips,
    ];

    // Limit total results to prevent overwhelming the UI
    const MAX_TOTAL_RESULTS = 15;
    const limitedResults = allResults.slice(0, MAX_TOTAL_RESULTS);

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
