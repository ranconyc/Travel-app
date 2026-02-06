import { NextRequest, NextResponse } from "next/server";
import { apiLockService } from "@/lib/services/api-lock.service";

export async function GET(req: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV !== "production";
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("q");

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Missing or invalid query param 'q'" },
        { status: 400 },
      );
    }

    // Create cache key for this query
    const cacheKey = `places-search:${name.toLowerCase().trim()}`;

    // Check if we have a cached result (1 hour TTL)
    const cachedResult = apiLockService.getCachedResult(cacheKey);
    if (cachedResult) {
      if (isDev) console.log(`🔒 Using cached result for query: ${name}`);
      return NextResponse.json(cachedResult);
    }

    // Acquire lock to prevent duplicate API calls for same query
    if (!apiLockService.acquireLock(cacheKey, 60 * 60 * 1000)) {
      // 1 hour TTL
      return NextResponse.json(
        { error: "Search already in progress, please try again in a moment" },
        { status: 429 },
      );
    }

    try {
      let query = name;

      // Handle Google Maps Short Links or Raw IDs
      let potentialShortLink = name;

      // If it looks like a raw short ID (alphanumeric, no spaces, 10-25 chars), construct URL
      if (/^[A-Za-z0-9_-]{10,25}$/.test(name)) {
        potentialShortLink = `https://maps.app.goo.gl/${name}`;
      }

      if (
        potentialShortLink.includes("maps.app.goo.gl") ||
        potentialShortLink.includes("goo.gl/maps")
      ) {
        try {
          const response = await fetch(potentialShortLink, {
            method: "HEAD",
            redirect: "manual",
          });
          const location = response.headers.get("location");
          if (location) {
            query = location;
          }
        } catch (e) {
          console.warn("Failed to expand short URL", e);
        }
      }

      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query,
      )}&key=${process.env.GOOGLE_PLACES_API_KEY}`;

      const response = await fetch(url, { next: { revalidate: 3600 } });
      const data = await response.json();

      // Cache the result
      apiLockService.releaseLock(cacheKey, data.results);

      return NextResponse.json(data.results);
    } catch (error) {
      // Release lock on error
      apiLockService.releaseLock(cacheKey);
      throw error;
    }
  } catch (err: any) {
    console.error("GET /api/google/places error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to fetch places" },
      { status: 500 },
    );
  }
}
