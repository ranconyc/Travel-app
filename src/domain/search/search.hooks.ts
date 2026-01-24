import { useQuery } from "@tanstack/react-query";
import {
  searchDestinationsAction,
  searchExternalDestinationsAction,
} from "./search.actions";

export function useSearch(query: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const res = await searchDestinationsAction({ query });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    enabled: options.enabled !== false && query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useExternalSearch(
  query: string,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ["search-external", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const res = await searchExternalDestinationsAction({ query });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    enabled: options.enabled === true && query.length >= 2,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
