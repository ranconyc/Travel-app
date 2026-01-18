import { getTravelHistory } from "@/domain/user/travelHistory.queries";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const { userId } = await params;

    const visits = await getTravelHistory(userId, 50);

    return NextResponse.json({ visits });
  } catch (error) {
    console.error("Travel history API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch travel history" },
      { status: 500 },
    );
  }
}
