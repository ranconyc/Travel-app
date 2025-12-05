import { getActivityById } from "@/lib/db/activity.repo";
import { getCityById } from "@/lib/db/cityLocation.repo";
import { createCountryFromName } from "@/lib/db/country.repo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("q");
    const countryId = searchParams.get("countryId");

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Missing or invalid query param 'q'" },
        { status: 400 }
      );
    }

    const cityId = `${name.toLowerCase()}-${countryId?.toLowerCase()}`;

    // check if city already exists in DB
    const DBResult = await getCityById(cityId);

    console.log(
      `${name.toLowerCase()}-${countryId?.toLowerCase()},DBResult`,
      DBResult
    );
    if (DBResult) {
      return NextResponse.json(
        {
          ok: true,
          created: false,
          city: DBResult,
        },
        { status: 200 }
      );
    }

    // const result = await createCityFromName(name);
    throw new Error("Not implemented");

    // return NextResponse.json(
    //   {
    //     ok: true,
    //     created: result.created,
    //     city: result.city,
    //   },
    //   { status: result.created ? 201 : 200 }
    // );
  } catch (err: any) {
    console.error("GET /api/cities/create error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to create city" },
      { status: 500 }
    );
  }
}
