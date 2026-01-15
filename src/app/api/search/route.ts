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

    // Search across all entity types in parallel
    const [cities, countries, activities] = await Promise.all([
      searchCities(query),
      searchCountries(query),
      searchActivities(query),
    ]);

    // Combine results with cities first, then countries, and activities
    const allResults: SearchResult[] = [...cities, ...countries, ...activities];

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
