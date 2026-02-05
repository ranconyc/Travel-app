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

export interface ImageResult {
  id: string;
  previewUrl: string;
  fullUrl: string;
  description: string;
  photographer: string;
  photographerUrl: string;
  source: "unsplash" | "pexels";
  attribution: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const count = parseInt(searchParams.get("count") || "12", 10);
    const orientation = searchParams.get("orientation") || "landscape";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 },
      );
    }

    const API_KEY = process.env.PEXELS_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        { error: "Pexels API key not configured", images: [] },
        { status: 500 },
      );
    }

    const response = await fetch(
      `https://api.pexels.com/v1/search?` +
        new URLSearchParams({
          query,
          per_page: String(Math.min(count, 80)),
          orientation,
          size: "large",
        }),
      {
        headers: {
          Authorization: API_KEY,
        },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      console.error("Pexels API error:", response.status);
      return NextResponse.json(
        { error: "Failed to fetch images", images: [] },
        { status: 500 },
      );
    }

    const data: PexelsResponse = await response.json();

    const images: ImageResult[] = data.photos.map((photo) => ({
      id: String(photo.id),
      previewUrl: photo.src.medium,
      fullUrl: photo.src.large2x,
      description: photo.alt || "Pexels photo",
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      source: "pexels" as const,
      attribution: `Photo by ${photo.photographer} on Pexels`,
    }));

    return NextResponse.json({ images, total: data.total_results });
  } catch (error) {
    console.error("Error in Pexels search API:", error);
    return NextResponse.json(
      { error: "Internal server error", images: [] },
      { status: 500 },
    );
  }
}
