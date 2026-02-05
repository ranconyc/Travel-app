import { NextRequest, NextResponse } from "next/server";

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
    full: string;
  };
  description: string | null;
  alt_description: string | null;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
    download_location: string;
  };
}

interface UnsplashResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
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

    const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

    if (!ACCESS_KEY) {
      return NextResponse.json(
        { error: "Unsplash API key not configured", images: [] },
        { status: 500 },
      );
    }

    const unsplashUrl =
      `https://api.unsplash.com/search/photos?` +
      new URLSearchParams({
        query,
        per_page: String(Math.min(count, 30)),
        orientation,
        content_filter: "high",
        order_by: "relevant",
      });

    const response = await fetch(unsplashUrl, {
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
        "Accept-Version": "v1",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error("Unsplash API error:", response.status);
      return NextResponse.json(
        { error: "Failed to fetch images", images: [] },
        { status: 500 },
      );
    }

    const data: UnsplashResponse = await response.json();

    const images: ImageResult[] = data.results.map((photo) => ({
      id: photo.id,
      previewUrl: photo.urls.small,
      fullUrl: photo.urls.regular,
      description:
        photo.alt_description || photo.description || "Unsplash photo",
      photographer: photo.user.name,
      photographerUrl: `https://unsplash.com/@${photo.user.username}?utm_source=travel_app&utm_medium=referral`,
      source: "unsplash" as const,
      attribution: `Photo by ${photo.user.name} on Unsplash`,
    }));

    return NextResponse.json({ images, total: data.total });
  } catch (error) {
    console.error("Error in Unsplash search API:", error);
    return NextResponse.json(
      { error: "Internal server error", images: [] },
      { status: 500 },
    );
  }
}
