import {
  MatchStrategy,
  UserPersona,
  UserForMatching,
  MatchResult,
  FactorScore,
} from "./MatchStrategy";

export class UserMatchStrategy extends MatchStrategy {
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
