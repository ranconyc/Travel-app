import { NextRequest, NextResponse } from "next/server";
import { unsplashService } from "@/domain/media/services/unsplash.service";
import { pexelsService } from "@/domain/media/services/pexels.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const orientation = searchParams.get("orientation") || "landscape";
    const category = searchParams.get("category") || "travel";
    const fallback = searchParams.get("fallback") === "true";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 },
      );
    }

    const buildQueryVariants = (raw: string): string[] => {
      const variants: string[] = [];

      const normalized = raw.trim();
      if (normalized) variants.push(normalized);

      // If query looks like "City, Country", try "City" as well.
      if (normalized.includes(",")) {
        const beforeComma = normalized.split(",")[0]?.trim();
        if (beforeComma) variants.push(beforeComma);

        // Also try removing commas entirely.
        const noCommas = normalized
          .replace(/,/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        if (noCommas) variants.push(noCommas);
      }

      // Remove extra whitespace
      const collapsed = normalized.replace(/\s+/g, " ").trim();
      if (collapsed) variants.push(collapsed);

      // Add fallback to just the city name if it contains "travel"
      if (normalized.includes("travel")) {
        const withoutTravel = normalized.replace(/\s+travel\s*$/i, "").trim();
        if (withoutTravel) variants.push(withoutTravel);
      }

      // Add generic fallback for cities that don't work
      const cityOnly = normalized
        .split(",")[0]
        ?.replace(/\s+travel\s*$/i, "")
        .trim();
      if (cityOnly && !variants.includes(cityOnly)) {
        variants.push(cityOnly);
      }

      // Deduplicate while preserving order
      return Array.from(new Set(variants));
    };

    const queryVariants = buildQueryVariants(query);

    const tryUnsplash = async (q: string) => {
      const imageUrl = await unsplashService.getUnsplashImage({
        query: q,
        orientation:
          orientation === "square"
            ? "squarish"
            : (orientation as "landscape" | "portrait"),
        category: category as "travel" | "city" | "nature" | "architecture",
      });

      if (!imageUrl) return null;
      return { imageUrl, source: "unsplash" as const, query: q };
    };

    const tryPexels = async (q: string) => {
      const imageUrl = await pexelsService.getPexelsImage({
        query: q,
        orientation:
          (orientation as "landscape" | "portrait" | "square") ?? "landscape",
      });

      if (!imageUrl) return null;
      return { imageUrl, source: "pexels" as const, query: q };
    };

    // Try Unsplash first
    for (const q of queryVariants) {
      try {
        const result = await tryUnsplash(q);
        if (result?.imageUrl) {
          console.log(
            `📷 Found Unsplash image for "${q}": ${result.query || q}`,
          );
          return NextResponse.json(result);
        }
      } catch {
        // Ignore and try next variant
      }
    }

    // Fallback to Pexels if enabled
    if (fallback) {
      for (const q of queryVariants) {
        try {
          const result = await tryPexels(q);
          if (result?.imageUrl) {
            console.log(
              `📷 Found Pexels image for "${q}": ${result.query || q}`,
            );
            return NextResponse.json(result);
          }
        } catch {
          // Ignore and try next variant
        }
      }
    }

    // Ultimate fallback - return a reliable travel image
    const ultimateFallback = {
      imageUrl:
        "https://images.unsplash.com/photo-1510279770292-4b34de9f5c23?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      source: "unsplash" as const,
      query: "ultimate fallback",
    };

    console.log(`📷 Using ultimate fallback for "${query}"`);
    return NextResponse.json(ultimateFallback);
  } catch (error) {
    console.error("Error in unified image API route:", error);
    return NextResponse.json(
      { error: "Internal server error", imageUrl: null },
      { status: 500 },
    );
  }
}
