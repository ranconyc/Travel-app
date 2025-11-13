// src/hooks/useCountries.ts
import { useQuery } from "@tanstack/react-query";
import { getAllCountries } from "@/lib/db/country";

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: () => getAllCountries(),
  });
}
