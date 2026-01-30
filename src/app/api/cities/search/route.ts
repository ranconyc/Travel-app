import { NextResponse } from "next/server";
import { searchCitiesWithFallback } from "@/domain/city/city.service";

/**
 * GET /api/cities/search?q=...
 * Simplified to use the unified service.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();

    if (!q || q.length < 2) {
      return NextResponse.json([]);
    }

    const results = await searchCitiesWithFallback(q, 10);
    return NextResponse.json(results);
  } catch (err) {
    console.error("GET /api/cities/search error", err);
    return NextResponse.json([], { status: 500 });
  }
}
