import { saveSearchEvent } from "@/lib/db/search.repo";

export async function handleTrackSearchEvent(data: {
  userId?: string;
  sessionId: string;
  searchQuery: string;
  resultCount?: number;
  clickedResultIndex?: number;
  clickedEntityType?: "city" | "country" | "activity";
  pagePath?: string;
}) {
  // Sanitize input
  const sanitizedData = {
    ...data,
    sessionId: data.sessionId.substring(0, 100), // Limit length
    searchQuery: data.searchQuery.substring(0, 200), // Limit length
    resultCount: Math.max(0, data.resultCount || 0),
    clickedResultIndex:
      data.clickedResultIndex !== undefined
        ? Math.max(0, data.clickedResultIndex)
        : undefined,
    pagePath: data.pagePath?.substring(0, 200),
  };

  return await saveSearchEvent(sanitizedData);
}
