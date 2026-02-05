import { PrismaClient } from "@prisma/client";
import {
  MatchStrategy,
  MatchRequest,
  MatchResult,
  BatchMatchRequest,
  UserPersona,
  FactorScore,
} from "../strategies/MatchStrategy";
import { UserMatchStrategy } from "../strategies/UserMatchStrategy";
import { PlaceMatchStrategy } from "../strategies/PlaceMatchStrategy";

export type {
  MatchRequest,
  MatchResult,
  BatchMatchRequest,
  UserPersona,
  FactorScore,
};

export class MatchingEngine {
  private strategies = new Map<string, MatchStrategy>();
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.strategies.set("user", new UserMatchStrategy());
    this.strategies.set("place", new PlaceMatchStrategy());
  }

  async calculateMatch(request: MatchRequest): Promise<MatchResult> {
    const strategy = this.strategies.get(request.targetType);
    if (!strategy) {
      throw new Error(
        `No strategy found for target type: ${request.targetType}`,
      );
    }

    // Check cache first
    const cached = await this.getCachedMatch(
      request.userId,
      request.targetType,
      request.targetId,
    );
    if (cached) {
      return cached;
    }

    // Fetch data and calculate
    const persona = await this.fetchUserPersona(request.userId);
    if (!persona) {
      throw new Error(`User persona not found for user: ${request.userId}`);
    }

    const target = await this.fetchTarget(request.targetType, request.targetId);
    if (!target) {
      throw new Error(
        `Target not found: ${request.targetType}:${request.targetId}`,
      );
    }

    const result = await strategy.calculate(persona, target, request.mode);

    // Cache the result
    await this.cacheMatchResult(request.userId, result);

    return result;
  }

  async calculateBatchMatches(
    batchRequest: BatchMatchRequest,
  ): Promise<MatchResult[]> {
    const persona = await this.fetchUserPersona(batchRequest.userId);
    if (!persona) {
      throw new Error(
        `User persona not found for user: ${batchRequest.userId}`,
      );
    }

    // Group requests by target type for efficiency
    const groupedRequests = batchRequest.requests.reduce(
      (acc, req) => {
        if (!acc[req.targetType]) acc[req.targetType] = [];
        acc[req.targetType].push(req);
        return acc;
      },
      {} as Record<string, typeof batchRequest.requests>,
    );

    const results: MatchResult[] = [];

    // Process each group
    for (const [targetType, requests] of Object.entries(groupedRequests)) {
      const strategy = this.strategies.get(targetType);
      if (!strategy) continue;

      // Fetch all targets of this type
      const targetIds = requests.map((req) => req.targetId);
      const targets = await this.fetchTargets(targetType, targetIds);

      // Calculate matches for each target
      for (const request of requests) {
        const target = targets.find((t) => (t as any).id === request.targetId);
        if (!target) continue;

        // Check cache first
        const cached = await this.getCachedMatch(
          batchRequest.userId,
          targetType,
          request.targetId,
        );
        if (cached) {
          results.push(cached);
          continue;
        }

        const result = await strategy.calculate(persona, target, request.mode);
        await this.cacheMatchResult(batchRequest.userId, result);
        results.push(result);
      }
    }

    return results;
  }

  async invalidateUserMatches(userId: string): Promise<void> {
    await this.prisma.matchScore.deleteMany({
      where: { userId },
    });
  }

  private async fetchUserPersona(userId: string): Promise<UserPersona | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: {
            include: {
              homeBaseCity: true,
            },
          },
        },
      });

      if (!user?.profile?.persona) {
        return null;
      }

      const persona = user.profile.persona as any;
      return {
        interests: persona.interests || [],
        budget: persona.budget,
        travelStyle: persona.travelStyle,
        travelRhythm: persona.travelRhythm,
        languages: user.profile.languages || [],
      };
    } catch (error) {
      console.error("Error fetching user persona:", error);
      return null;
    }
  }

  private async fetchTarget(
    targetType: string,
    targetId: string,
  ): Promise<any> {
    switch (targetType) {
      case "user":
        return this.prisma.user.findUnique({
          where: { id: targetId },
          include: {
            profile: {
              include: {
                homeBaseCity: true,
              },
            },
            currentCity: {
              include: {
                country: true,
              },
            },
          },
        });

      case "place":
        return this.prisma.place.findUnique({
          where: { id: targetId },
          select: {
            id: true,
            tags: true,
            priceLevel: true,
            vibeScores: true,
            categories: true,
          },
        });

      default:
        throw new Error(`Unknown target type: ${targetType}`);
    }
  }

  private async fetchTargets(
    targetType: string,
    targetIds: string[],
  ): Promise<any[]> {
    switch (targetType) {
      case "user":
        return this.prisma.user.findMany({
          where: { id: { in: targetIds } },
          include: {
            profile: {
              include: {
                homeBaseCity: true,
              },
            },
            currentCity: {
              include: {
                country: true,
              },
            },
          },
        });

      case "place":
        return this.prisma.place.findMany({
          where: { id: { in: targetIds } },
          select: {
            id: true,
            tags: true,
            priceLevel: true,
            vibeScores: true,
            categories: true,
          },
        });

      default:
        throw new Error(`Unknown target type: ${targetType}`);
    }
  }

  private async getCachedMatch(
    userId: string,
    targetType: string,
    targetId: string,
  ): Promise<MatchResult | null> {
    try {
      const cached = await this.prisma.matchScore.findFirst({
        where: {
          userId,
          targetType,
          targetId,
          expiresAt: { gt: new Date() },
        },
        orderBy: { calculatedAt: "desc" },
      });

      if (!cached) return null;

      return {
        score: cached.score,
        confidence: this.getConfidence(cached.score),
        breakdown: cached.breakdown as unknown as Record<string, FactorScore>,
        reasoning: cached.reasoning,
        metadata: {
          targetType: cached.targetType as "user" | "place",
          targetId: cached.targetId,
          factorsUsed: Object.keys(
            cached.breakdown as unknown as Record<string, any>,
          ),
          calculatedAt: cached.calculatedAt.toISOString(),
        },
      };
    } catch (error) {
      console.error("Error fetching cached match:", error);
      return null;
    }
  }

  private async cacheMatchResult(
    userId: string,
    result: MatchResult,
  ): Promise<void> {
    try {
      // Set expiration to 1 hour from now
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await this.prisma.matchScore.upsert({
        where: {
          userId_targetType_targetId: {
            userId,
            targetType: result.metadata.targetType,
            targetId: result.metadata.targetId,
          },
        },
        update: {
          score: result.score,
          breakdown: result.breakdown as any,
          reasoning: result.reasoning,
          calculatedAt: new Date(result.metadata.calculatedAt),
          expiresAt,
        },
        create: {
          userId,
          targetType: result.metadata.targetType,
          targetId: result.metadata.targetId,
          score: result.score,
          breakdown: result.breakdown as any,
          reasoning: result.reasoning,
          expiresAt,
        },
      });
    } catch (error) {
      console.error("Error caching match result:", error);
    }
  }

  private getConfidence(score: number): "high" | "medium" | "low" {
    if (score >= 80) return "high";
    if (score >= 60) return "medium";
    return "low";
  }
}
