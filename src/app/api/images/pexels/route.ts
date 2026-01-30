import { NextRequest, NextResponse } from "next/server";

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

interface PexelsResponse {
  photos: PexelsPhoto[];
  total_results: number;
  next_page: string;
  prev_page: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV !== "production";
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const orientation = searchParams.get("orientation") || "landscape";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 },
      );
    }

    const API_KEY = process.env.PEXELS_API_KEY;

    if (!API_KEY) {
      console.error("Pexels API key not configured");
      return NextResponse.json(
        { error: "Image service not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(
      `https://api.pexels.com/v1/search?` +
        new URLSearchParams({
          query,
          per_page: "1",
          orientation,
          size: "large",
        }),
      {
        headers: {
          Authorization: API_KEY,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    if (!response.ok) {
      console.error("Pexels API error:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: 500 },
      );
    }

    const data: PexelsResponse = await response.json();

    if (data.photos.length === 0) {
      return NextResponse.json(
        { error: "No images found", imageUrl: null },
        { status: 200 },
      );
    }

    const photo = data.photos[0];
    if (isDev) console.log(`Found Pexels image for "${query}": ${photo.alt}`);

    return NextResponse.json({
      imageUrl: photo.src.large,
      description: photo.alt,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      attribution: `Photo by ${photo.photographer} on Pexels`,
    });
  } catch (error) {
    console.error("Error in Pexels API route:", error);
    return NextResponse.json(
      { error: "Internal server error", imageUrl: null },
      { status: 500 },
    );
  }
}
