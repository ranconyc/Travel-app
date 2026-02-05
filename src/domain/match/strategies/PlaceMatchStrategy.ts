import {
  MatchStrategy,
  UserPersona,
  PlaceForMatching,
  MatchResult,
  FactorScore,
} from "./MatchStrategy";

export class PlaceMatchStrategy extends MatchStrategy {
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
