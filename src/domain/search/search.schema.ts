import { z } from "zod";

export const SearchResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["COUNTRY", "CITY", "EXTERNAL"]),
  slug: z.string(),
  image: z.string().nullish(),
  subText: z.string().optional(),
  flag: z.string().nullish(),
  externalData: z.any().optional(),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;

export const SearchDestinationsSchema = z.object({
  query: z.string().min(2),
});

export const TrackSearchSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string().min(1, "Session ID is required"),
  searchQuery: z.string().min(1, "Search query is required"),
  resultCount: z.number().optional(),
  clickedResultIndex: z.number().optional(),
  clickedEntityType: z.enum(["city", "country", "activity"]).optional(),
  pagePath: z.string().optional(),
});
