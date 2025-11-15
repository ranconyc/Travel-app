// src/hooks/useCountries.ts
import { useQuery } from "@tanstack/react-query";
import { getAllCities } from "@/lib/db/city";

// React Query hook to fetch all cities
export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: () => getAllCities(),
    staleTime: 1000 * 60 * 60, // 1 hour - cities don't change often
  });
}
