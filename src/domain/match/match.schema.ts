export type MatchResult = {
  score: number; // 0-100
  breakdown: {
    languages: { score: number; distinct: string[]; shared: string[] };
    places: { score: number; distinct: number; shared: string[] };
    interests: { score: number; distinct: string[]; shared: string[] };
    location: {
      score: number;
      sameCity: boolean;
      sameCountry: boolean;
      city?: string;
      country?: string;
    };
    age: { score: number; isWithinRange: boolean; diffYears: number };
    friends: { score: number; count: number; mutualNames: string[] };
    futurePlans: { score: number; count: number; sharedDestinations: string[] };
    travelStyle: { score: number; styles: string[]; shared: string[] };
    proximity: { score: number; distanceKm: number | null };
  };
};
