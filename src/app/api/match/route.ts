import { NextRequest, NextResponse } from "next/server";
import { MatchingEngine } from "@/domain/match/services/matching-engine";
import { prisma } from "@/lib/db/prisma";

const matchingEngine = new MatchingEngine(prisma);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Single match request
    if (body.targetType && body.targetId && body.userId) {
      const matchResult = await matchingEngine.calculateMatch({
        userId: body.userId,
        targetType: body.targetType,
        targetId: body.targetId,
        mode: body.mode,
      });

      return NextResponse.json(matchResult);
    }

    // Batch match request
    if (body.requests && body.userId) {
      const matchResults = await matchingEngine.calculateBatchMatches({
        userId: body.userId,
        requests: body.requests,
      });

      return NextResponse.json(matchResults);
    }

    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error in match API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required" },
        { status: 400 },
      );
    }

    await matchingEngine.invalidateUserMatches(userId);

    return NextResponse.json({
      message: "Match cache invalidated successfully",
      userId,
    });
  } catch (error) {
    console.error("Error invalidating match cache:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
