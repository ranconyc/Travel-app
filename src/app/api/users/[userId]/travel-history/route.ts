import { getUnifiedTravelHistory } from "@/domain/user/travel-history.service";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const visits = await getUnifiedTravelHistory(userId);
    return NextResponse.json({ visits });
  } catch (error) {
    // If error is "User not found", return 404
    if (error instanceof Error && error.message === "User not found") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.error("Travel history API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch travel history" },
      { status: 500 },
    );
  }
}
