/**
 * Search feature type definitions
 */

export type SearchResultType = "city" | "country" | "activity" | "trip";

export interface SearchResult {
  id: string; // Unique identifier for the autocomplete
  label: string; // Display text (e.g., "Paris, France")
  subtitle?: string; // Additional info (e.g., country code or activity type)
  type: SearchResultType; // Entity type
  entityId: string; // The actual database ID
  meta?: {
    countryName?: string;
    cityName?: string;
    tripType?: string;
    activityType?: string;
  } & Record<string, unknown>;
}

export interface SearchEventData {
  userId?: string; // User ID if logged in
  sessionId: string; // Session identifier for anonymous tracking
  searchQuery: string; // What the user searched for
  resultCount: number; // Number of results returned
  clickedResultIndex?: number; // Index of clicked result (0-based)
  clickedEntityType?: SearchResultType; // Type of entity clicked
  pagePath?: string; // Where the search happened
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
}
