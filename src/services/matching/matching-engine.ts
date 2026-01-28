import { PrismaClient } from "@prisma/client";

// ============================================
// INTERFACES
// ============================================

export interface UserPersona {
  interests: string[];
  budget?: "budget" | "mid-range" | "luxury";
  travelStyle?: string[];
  travelRhythm?: string;
  languages?: string[];
  ageRange?: [number, number];
  safetyPreference?: "low" | "medium" | "high";
}

export interface PlaceForMatching {
  tags: string[];
  priceLevel?: number | null;
  vibeScores?: any;
  categories?: string[];
}

export interface UserForMatching {
  id: string;
  profile?: {
    languages?: string[];
    persona?: any;
    birthday?: Date;
  };
  currentCity?: {
    countryRefId?: string;
    name?: string;
    country?: {
      name?: string;
      code?: string;
    };
  };
}

export interface FactorScore {
  score: number;
  value?: any;
  explanation: string;
  shared?: string[];
}

export interface MatchResult {
  score: number;
  confidence: "high" | "medium" | "low";
  breakdown: Record<string, FactorScore>;
  reasoning: string[];
  metadata: {
    targetType: "user" | "place";
    targetId: string;
    factorsUsed: string[];
    calculatedAt: string;
  };
}

export interface MatchRequest {
  userId: string;
  targetType: "user" | "place";
  targetId: string;
  mode?: "current" | "travel"; // Only for user-to-user
}

export interface BatchMatchRequest {
  userId: string;
  requests: Array<{
    targetType: "user" | "place";
    targetId: string;
    mode?: "current" | "travel";
  }>;
}

// ============================================
// STRATEGY PATTERN
// ============================================

abstract class MatchStrategy {
  abstract getWeights(): Record<string, number>;
  abstract calculate(
    persona: UserPersona,
    target: any,
    mode?: string,
  ): Promise<MatchResult>;

  protected calculateWeightedScore(
    factors: Record<string, FactorScore>,
    weights: Record<string, number>,
  ): number {
    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(factors).forEach(([factor, score]) => {
      const weight = weights[factor] || 0;
      totalScore += score.score * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }

  protected getConfidence(score: number): "high" | "medium" | "low" {
    if (score >= 80) return "high";
    if (score >= 60) return "medium";
    return "low";
  }
}

// ============================================
// USER-TO-USER STRATEGY
// ============================================

class UserMatchStrategy extends MatchStrategy {
  getWeights(): Record<string, number> {
    return {
      languages: 0.3,
      travelStyle: 0.25,
      interests: 0.2,
      age: 0.15,
      location: 0.1,
    };
  }

  async calculate(
    persona: UserPersona,
    targetUser: UserForMatching,
    mode: string = "travel",
  ): Promise<MatchResult> {
    const factors: Record<string, FactorScore> = {};
    const reasoning: string[] = [];
    const weights = this.getWeights();

    // 1. Language Overlap (30%)
    if (persona.languages && targetUser.profile?.languages) {
      const sharedLanguages = persona.languages.filter((lang) =>
        targetUser.profile?.languages?.includes(lang),
      );

      if (sharedLanguages.length === 0) {
        factors.languages = { score: 0, explanation: "No common languages" };
        reasoning.push("Language barrier - no common languages");
      } else {
        const bonus = Math.min(sharedLanguages.length * 20, 100);
        factors.languages = {
          score: bonus,
          shared: sharedLanguages,
          explanation: `Speak ${sharedLanguages.length} common language(s): ${sharedLanguages.join(", ")}`,
        };
        reasoning.push(`Can communicate in ${sharedLanguages.join(", ")}`);
      }
    } else {
      factors.languages = {
        score: 50,
        explanation: "Language data unavailable",
      };
    }

    // 2. Travel Style (25%)
    if (persona.travelStyle && targetUser.profile?.persona) {
      const userStyle = Array.isArray(persona.travelStyle)
        ? persona.travelStyle[0]
        : persona.travelStyle;
      const targetPersona = targetUser.profile.persona as any;
      const targetStyle = Array.isArray(targetPersona?.travelStyle)
        ? targetPersona.travelStyle[0]
        : targetPersona?.travelStyle;

      if (userStyle && targetStyle && userStyle === targetStyle) {
        factors.travelStyle = {
          score: 100,
          value: targetStyle,
          explanation: `Same travel style: ${targetStyle}`,
        };
        reasoning.push(`Both love ${targetStyle} travel`);
      } else if (userStyle && targetStyle) {
        // Check for incompatible styles
        const isClash =
          (userStyle === "Luxury" && targetStyle === "Backpacker") ||
          (userStyle === "Backpacker" && targetStyle === "Luxury");

        if (isClash) {
          factors.travelStyle = {
            score: 0,
            value: { user: userStyle, target: targetStyle },
            explanation: `Incompatible travel styles: ${userStyle} vs ${targetStyle}`,
          };
          reasoning.push("Travel style clash - different budget preferences");
        } else {
          factors.travelStyle = {
            score: 60,
            value: { user: userStyle, target: targetStyle },
            explanation: `Different but compatible styles: ${userStyle} vs ${targetStyle}`,
          };
        }
      }
    } else {
      factors.travelStyle = {
        score: 50,
        explanation: "Travel style data unavailable",
      };
    }

    // 3. Shared Interests (20%)
    if (persona.interests && targetUser.profile?.persona?.interests) {
      const sharedInterests = persona.interests.filter((interest) =>
        targetUser.profile?.persona?.interests.includes(interest),
      );

      if (sharedInterests.length > 0) {
        const score = Math.min(sharedInterests.length * 25, 100);
        factors.interests = {
          score,
          shared: sharedInterests,
          explanation: `${sharedInterests.length} shared interests: ${sharedInterests.join(", ")}`,
        };
        reasoning.push(`Both love ${sharedInterests.join(" & ")}`);
      } else {
        factors.interests = { score: 0, explanation: "No shared interests" };
      }
    } else {
      factors.interests = {
        score: 50,
        explanation: "Interest data unavailable",
      };
    }

    // 4. Age Gap (15%)
    if (persona.ageRange && targetUser.profile?.birthday) {
      const targetAge = this.calculateAge(targetUser.profile.birthday);
      const [minAge, maxAge] = persona.ageRange;

      if (targetAge >= minAge && targetAge <= maxAge) {
        factors.age = {
          score: 100,
          value: targetAge,
          explanation: `Age ${targetAge} fits preferred range ${minAge}-${maxAge}`,
        };
        reasoning.push("Age compatibility");
      } else {
        const ageDiff = Math.min(
          Math.abs(targetAge - minAge),
          Math.abs(targetAge - maxAge),
        );
        const score = Math.max(0, 100 - ageDiff * 5);
        factors.age = {
          score,
          value: targetAge,
          explanation: `Age ${targetAge} outside preferred range ${minAge}-${maxAge}`,
        };
      }
    } else {
      factors.age = { score: 50, explanation: "Age preference unavailable" };
    }

    // 5. Location/Proximity (10%)
    if (targetUser.currentCity?.countryRefId) {
      // This would need the user's current location - simplified for now
      factors.location = {
        score: 70,
        value: targetUser.currentCity,
        explanation: `Located in ${targetUser.currentCity.name || "Unknown"}`,
      };
    } else {
      factors.location = {
        score: 50,
        explanation: "Location data unavailable",
      };
    }

    const finalScore = this.calculateWeightedScore(factors, weights);

    return {
      score: finalScore,
      confidence: this.getConfidence(finalScore),
      breakdown: factors,
      reasoning,
      metadata: {
        targetType: "user",
        targetId: targetUser.id,
        factorsUsed: Object.keys(factors),
        calculatedAt: new Date().toISOString(),
      },
    };
  }

  private calculateAge(birthday: Date): number {
    const diff = Date.now() - birthday.getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  }
}

// ============================================
// USER-TO-PLACE STRATEGY
// ============================================

class PlaceMatchStrategy extends MatchStrategy {
  getWeights(): Record<string, number> {
    return {
      interests: 0.5,
      budget: 0.3,
      vibe: 0.2,
    };
  }

  async calculate(
    persona: UserPersona,
    place: PlaceForMatching,
  ): Promise<MatchResult> {
    const factors: Record<string, FactorScore> = {};
    const reasoning: string[] = [];
    const weights = this.getWeights();

    // 1. Interests/Tags (50%)
    if (persona.interests && place.tags) {
      const matchingInterests = persona.interests.filter((interest) =>
        place.tags.includes(interest),
      );

      if (matchingInterests.length > 0) {
        const matchRatio =
          matchingInterests.length /
          Math.max(persona.interests.length, place.tags.length);
        const score = Math.round(matchRatio * 100);
        factors.interests = {
          score,
          shared: matchingInterests,
          explanation: `${matchingInterests.length} matching interests: ${matchingInterests.join(", ")}`,
        };
        reasoning.push(`Perfect for ${matchingInterests.join(" & ")} lovers`);
      } else {
        factors.interests = { score: 0, explanation: "No matching interests" };
      }
    } else {
      factors.interests = {
        score: 50,
        explanation: "Interest data unavailable",
      };
    }

    // 2. Budget/PriceLevel (30%) - Heavy penalties for mismatch
    if (
      persona.budget &&
      place.priceLevel !== undefined &&
      place.priceLevel !== null
    ) {
      const budgetToPriceLevel: Record<string, number> = {
        budget: 1,
        "mid-range": 2,
        luxury: 4,
      };

      const userPriceLevel =
        budgetToPriceLevel[persona.budget.toLowerCase()] || 2;
      const priceDifference = Math.abs(userPriceLevel - place.priceLevel);

      if (priceDifference === 0) {
        factors.budget = {
          score: 100,
          value: { user: persona.budget, place: place.priceLevel },
          explanation: `Perfect budget match: ${persona.budget}`,
        };
        reasoning.push(`Perfect for ${persona.budget} budget`);
      } else if (priceDifference === 1) {
        factors.budget = {
          score: 70,
          value: { user: persona.budget, place: place.priceLevel },
          explanation: `Good budget fit: ${persona.budget} vs level ${place.priceLevel}`,
        };
        reasoning.push(`Fits ${persona.budget} budget`);
      } else if (priceDifference === 2) {
        factors.budget = {
          score: 30,
          value: { user: persona.budget, place: place.priceLevel },
          explanation: `Budget stretch: ${persona.budget} vs level ${place.priceLevel}`,
        };
      } else {
        factors.budget = {
          score: 0,
          value: { user: persona.budget, place: place.priceLevel },
          explanation: `Budget mismatch: ${persona.budget} vs level ${place.priceLevel}`,
        };
        reasoning.push(`Too expensive for ${persona.budget} budget`);
      }
    } else {
      factors.budget = { score: 50, explanation: "Budget data unavailable" };
    }

    // 3. Vibe (20%)
    if (place.vibeScores && typeof place.vibeScores === "object") {
      const vibeData = place.vibeScores as Record<string, any>;
      let totalVibeScore = 0;
      let vibeCount = 0;

      if (typeof vibeData.overall === "number") {
        totalVibeScore += vibeData.overall;
        vibeCount++;
      } else {
        const vibeKeys = [
          "quiet",
          "crowded",
          "touristy",
          "local",
          "modern",
          "traditional",
        ];
        for (const key of vibeKeys) {
          const value = vibeData[key];
          if (typeof value === "number") {
            totalVibeScore += value;
            vibeCount++;
          }
        }
      }

      if (vibeCount > 0) {
        const score = Math.round((totalVibeScore / vibeCount) * 10);
        factors.vibe = {
          score: Math.min(100, Math.max(0, score)),
          value: place.vibeScores,
          explanation: `Vibe score: ${score}/100 based on place characteristics`,
        };
      } else {
        factors.vibe = {
          score: 60,
          explanation: "No specific vibe data, using default score",
        };
      }
    } else {
      factors.vibe = { score: 60, explanation: "Vibe scores unavailable" };
    }

    const finalScore = this.calculateWeightedScore(factors, weights);

    return {
      score: finalScore,
      confidence: this.getConfidence(finalScore),
      breakdown: factors,
      reasoning,
      metadata: {
        targetType: "place",
        targetId: (place as any).id || "unknown",
        factorsUsed: Object.keys(factors),
        calculatedAt: new Date().toISOString(),
      },
    };
  }
}

// ============================================
// UNIFIED MATCHING ENGINE
// ============================================

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
