import { Place } from "@/domain/place/place.schema";
import { UserPersona } from "@/domain/persona/persona.schema";

export interface MatchScoreResult {
  score: number;
  breakdown: {
    interests: number;
    budget: number;
    vibe: number;
  };
  reasoning: string[];
}

export interface UserPersonaForMatching {
  interests: string[];
  budget?: string;
  travelStyle?: string[];
  travelRhythm?: string;
}

/**
 * Calculate match score between a user persona and a place
 * 
 * Weights:
 * - Interests (50%): Check if place.tags overlap with user.interests
 * - Budget (25%): Compare user.budget vs place.priceLevel  
 * - Vibe/Context (25%): Use the vibeScores field
 * 
 * @param userPersona - User's persona data
 * @param place - Place data from database
 * @returns Match score between 0-100 with breakdown
 */
export function calculateMatchScore(
  userPersona: UserPersonaForMatching,
  place: Place
): MatchScoreResult {
  const breakdown = {
    interests: 0,
    budget: 0,
    vibe: 0
  };
  
  const reasoning: string[] = [];

  // 1. Interests Score (50% weight)
  const userInterests = userPersona.interests || [];
  const placeTags = place.tags || [];
  
  if (userInterests.length > 0 && placeTags.length > 0) {
    const matchingInterests = userInterests.filter(interest => 
      placeTags.includes(interest)
    );
    
    const interestMatchRatio = matchingInterests.length / Math.max(userInterests.length, placeTags.length);
    breakdown.interests = Math.round(interestMatchRatio * 100);
    
    if (matchingInterests.length > 0) {
      reasoning.push(`Matches ${matchingInterests.length} interests: ${matchingInterests.join(', ')}`);
    }
  } else {
    reasoning.push('No interest data available');
  }

  // 2. Budget Score (25% weight)
  if (userPersona.budget && place.priceLevel !== undefined && place.priceLevel !== null) {
    // Map budget strings to price levels
    const budgetToPriceLevel: Record<string, number> = {
      'budget': 1,
      'mid-range': 2,
      'moderate': 2,
      'comfortable': 3,
      'luxury': 4,
      'premium': 4
    };
    
    const userPriceLevel = budgetToPriceLevel[userPersona.budget.toLowerCase()] || 2;
    const priceDifference = Math.abs(userPriceLevel - place.priceLevel);
    
    // Score based on how close the price levels are
    breakdown.budget = Math.max(0, 100 - (priceDifference * 25));
    
    if (priceDifference === 0) {
      reasoning.push(`Perfect budget match (${userPersona.budget})`);
    } else if (priceDifference <= 1) {
      reasoning.push(`Good budget fit (${userPersona.budget} vs price level ${place.priceLevel})`);
    } else {
      reasoning.push(`Budget mismatch (${userPersona.budget} vs price level ${place.priceLevel})`);
    }
  } else {
    breakdown.budget = 50; // Neutral score if no data
    reasoning.push('No budget data available');
  }

  // 3. Vibe Score (25% weight)
  if (place.vibeScores && typeof place.vibeScores === 'object') {
    // Extract vibe score from the JSON field
    const vibeData = place.vibeScores as any;
    
    // Look for common vibe indicators
    let totalVibeScore = 0;
    let vibeCount = 0;
    
    if (vibeData.overall) {
      totalVibeScore += vibeData.overall;
      vibeCount++;
    }
    
    // If no overall score, try to calculate from individual vibes
    if (vibeCount === 0) {
      const vibeKeys = ['quiet', 'crowded', 'touristy', 'local', 'modern', 'traditional'];
      for (const key of vibeKeys) {
        if (typeof vibeData[key] === 'number') {
          totalVibeScore += vibeData[key];
          vibeCount++;
        }
      }
    }
    
    if (vibeCount > 0) {
      breakdown.vibe = Math.round((totalVibeScore / vibeCount) * 10); // Scale to 0-100
      reasoning.push(`Vibe score: ${breakdown.vibe}/100 based on place characteristics`);
    } else {
      breakdown.vibe = 60; // Default decent score
      reasoning.push('No specific vibe data, using default score');
    }
  } else {
    breakdown.vibe = 60; // Default decent score
    reasoning.push('No vibe scores available, using default score');
  }

  // Calculate final weighted score
  const finalScore = Math.round(
    (breakdown.interests * 0.5) + 
    (breakdown.budget * 0.25) + 
    (breakdown.vibe * 0.25)
  );

  return {
    score: Math.min(100, Math.max(0, finalScore)),
    breakdown,
    reasoning
  };
}

/**
 * Get score color class for UI display
 */
export function getScoreColorClass(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-gray-500';
}

/**
 * Get score label for UI display
 */
export function getScoreLabel(score: number): string {
  if (score >= 80) return 'High Match';
  if (score >= 50) return 'Medium Match';
  return 'Low Match';
}
