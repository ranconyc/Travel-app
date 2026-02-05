/**
 * Debug API endpoint to test the location update flow.
 * Access via: GET /api/debug/location-flow?lat=48.1351&lng=11.582
 */

import { NextRequest, NextResponse } from "next/server";
import { findNearestCityFromCoords } from "@/domain/city/city.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = parseFloat(searchParams.get("lat") || "48.1351");
  const lng = parseFloat(searchParams.get("lng") || "11.582");

  console.log(`🧪 Testing Location Flow for: ${lat}, ${lng}`);

  try {
    const result = await findNearestCityFromCoords(lat, lng, {
      createIfMissing: true,
      searchRadiusKm: 100,
    });

    return NextResponse.json({
      success: true,
      input: { lat, lng },
      result: {
        id: result.id,
        cityId: result.cityId,
        cityName: result.cityName,
        countryCode: result.countryCode,
        label: result.label,
        source: result.source,
        distanceKm: result.distanceKm,
        radiusKm: result.radiusKm,
      },
      hydrationUsed:
        result.source === "json-db-created" ? "JSON" : result.source,
    });
  } catch (error) {
    console.error("Location flow test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
