// src/app/api/climate/seasons/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const latStr = searchParams.get("lat");
  const lngStr = searchParams.get("lng");

  if (!latStr || !lngStr) {
    return NextResponse.json(
      { error: "Missing lat or lng query params" },
      { status: 400 }
    );
  }

  const lat = Number(latStr);
  const lng = Number(lngStr);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Invalid lat/lng" }, { status: 400 });
  }

  try {
    // 1) Call weather API (Meteostat)
    // const normals = await fetchClimateNormals(lat, lng);

    // 2) Calculate best & worst seasons
    // const best = inferBestSeason(normals);
    // const worst = inferWorstSeason(normals);

    // return NextResponse.json({
    //   lat,
    //   lng,
    //   bestSeasonLabel: best.label,
    //   worstSeasonLabel: worst.label,
    //   best,
    //   worst,
    // });
    throw new Error("Not implemented");
  } catch (err: any) {
    console.error("climate/seasons error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to compute seasons" },
      { status: 500 }
    );
  }
}
