// src/hooks/useCountries.ts
import { useQuery } from "@tanstack/react-query";

type LanguageItem = {
  code: string;
  name: string;
  flag?: string;
};

// React Query hook to fetch languages data
export function useLanguages() {
  return useQuery<LanguageItem[]>({
    queryKey: ["languages"],
    queryFn: async () => {
      const { default: languagesData } = await import("../../../data/languages.json");
      return languagesData as LanguageItem[];
    },
    staleTime: Infinity, // Never refetch static data
  });
}

import { getAllCitiesAction } from "@/app/actions/locationActions";

// React Query hook to fetch all cities
export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: () => getAllCitiesAction(),
    staleTime: 1000 * 60 * 60, // 1 hour - cities don't change often
  });
}
