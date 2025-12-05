import { createCountryFromName } from "@/lib/db/country.repo";
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

    const result = await createCountryFromName(name);

    return NextResponse.json(
      {
        ok: true,
        created: result.created,
        country: result.country,
      },
      { status: result.created ? 201 : 200 }
    );
  } catch (err: any) {
    console.error("GET /api/countries/create error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to create country" },
      { status: 500 }
    );
  }
}
