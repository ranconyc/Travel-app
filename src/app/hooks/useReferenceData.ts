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
      const { default: languagesData } = await import(
        "../../../data/languages.json"
      );
      return languagesData as LanguageItem[];
    },
    staleTime: Infinity, // Never refetch static data
  });
}
