import { NextResponse } from "next/server";
import { getAllPlaces } from "@/lib/db/place.repo";

export async function GET() {
  try {
    const places = await getAllPlaces();
    
    const placeInfo = places.map(place => ({
      id: place.id,
      name: place.name,
      slug: place.slug,
      hasSlug: !!place.slug,
      cityRefId: place.cityRefId,
      googlePlaceId: place.googlePlaceId,
      imageHeroUrl: place.imageHeroUrl,
      rating: place.rating,
      tags: place.tags
    }));

    return NextResponse.json({
      totalPlaces: places.length,
      placesWithSlugs: placeInfo.filter(p => p.hasSlug).length,
      placesWithoutSlugs: placeInfo.filter(p => !p.hasSlug).length,
      places: placeInfo.slice(0, 10) // Return first 10 for debugging
    });

  } catch (error) {
    console.error("Debug places error:", error);
    return NextResponse.json(
      { error: "Failed to fetch places", details: String(error) },
      { status: 500 }
    );
  }
}
