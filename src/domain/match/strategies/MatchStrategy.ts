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

export abstract class MatchStrategy {
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
