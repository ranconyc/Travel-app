import interestsData from "@/data/interests.json";

export interface GooglePlaceResult {
  place_id: string;
  name: string;
  types: string[];
  price_level?: number;
  [key: string]: any;
}

/**
 * Mappings for our internal Discovery taxonomy.
 */
export function mapGoogleResultToInterests(place: GooglePlaceResult): string[] {
  const matches = new Set<string>();
  const categories = Object.values(interestsData);

  for (const category of categories) {
    for (const item of category.items) {
      const googleTypes = (item as any).google_types || [];
      const googleKeywords = (item as any).google_keywords || [];

      // 1. Match by Google Types
      const hasTypeMatch = googleTypes.some((type: string) =>
        place.types.includes(type),
      );

      // 2. Match by Keywords in Name (case-insensitive)
      const placeName = place.name.toLowerCase();
      const hasKeywordMatch = googleKeywords.some((kw: string) =>
        placeName.includes(kw.toLowerCase()),
      );

      if (hasTypeMatch || hasKeywordMatch) {
        matches.add(item.id);
      }
    }
  }

  return Array.from(matches);
}

/**
 * Translates an internal interestId into Google search terms.
 */
export function getGoogleSearchTermsForInterest(interestId: string): string[] {
  const categories = Object.values(interestsData);
  for (const category of categories) {
    const item = category.items.find((i) => i.id === interestId);
    if (item) {
      return (item as any).google_keywords || [];
    }
  }
  return [];
}
