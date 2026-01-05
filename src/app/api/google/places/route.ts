import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("q");

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Missing or invalid query param 'q'" },
        { status: 400 }
      );
    }
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      name
    )}&key=${process.env.GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url, { next: { revalidate: 3600 } });

    const data = await response.json();

    return NextResponse.json(data.results);
  } catch (err: any) {
    console.error("GET /api/google/places error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to fetch places" },
      { status: 500 }
    );
  }
}
