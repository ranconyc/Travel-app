import { NextRequest, NextResponse } from "next/server";
import { getPlaceBySlug } from "@/lib/db/place.repo";
import { PlaceImagesService } from "@/services/place-images.service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Get place data
    const place = await getPlaceBySlug(id);
    if (!place) {
      return NextResponse.json(
        { error: "Place not found" },
        { status: 404 }
      );
    }

    // Get images for the place
    const images = await PlaceImagesService.getPlaceImages(place as any, 5);
    
    return NextResponse.json({
      placeId: place.id,
      placeName: place.name,
      images,
      heroImage: images[0],
      count: images.length
    });

  } catch (error) {
    console.error("Error fetching place images:", error);
    return NextResponse.json(
      { error: "Failed to fetch place images" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Get place data
    const place = await getPlaceBySlug(id);
    if (!place) {
      return NextResponse.json(
        { error: "Place not found" },
        { status: 404 }
      );
    }

    // Get fresh images for the place
    const images = await PlaceImagesService.getPlaceImages(place as any, 5);
    
    return NextResponse.json({
      success: true,
      message: "Place images fetched successfully",
      images
    });

  } catch (error) {
    console.error("Error updating place images:", error);
    return NextResponse.json(
      { error: "Failed to update place images" },
      { status: 500 }
    );
  }
}
