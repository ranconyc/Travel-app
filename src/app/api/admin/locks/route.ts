import { NextRequest, NextResponse } from "next/server";
import { GooglePlacesService } from "@/domain/discovery/googlePlaces.service";
import { apiLockService } from "@/services/api-lock.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cityId = searchParams.get("cityId");
    const interestId = searchParams.get("interestId");

    // Get overall lock statistics
    const lockStats = apiLockService.getStats();
    
    // Get Google Places service stats
    const googlePlacesStats = GooglePlacesService.getLockStats();

    let syncStatus = null;
    if (cityId && interestId) {
      syncStatus = GooglePlacesService.getSyncStatus(cityId, interestId);
    }

    return NextResponse.json({
      lockStats,
      googlePlacesStats,
      syncStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("GET /api/admin/locks error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to fetch lock statistics" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cityId = searchParams.get("cityId");
    const interestId = searchParams.get("interestId");

    if (cityId && interestId) {
      // Clear specific lock
      const lockKey = `sync:${cityId}:${interestId}`;
      (apiLockService as any).locks.delete(lockKey);
      
      return NextResponse.json({
        message: `Cleared lock for ${cityId}:${interestId}`,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Clear all expired locks
      apiLockService.cleanup();
      
      return NextResponse.json({
        message: "Cleaned up expired locks",
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err: any) {
    console.error("DELETE /api/admin/locks error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to clear locks" },
      { status: 500 }
    );
  }
}
