import { useQuery } from "@tanstack/react-query";
import { getAllCountriesAction } from "@/domain/country/country.actions";
import type { Country } from "@/domain/country/country.schema";

export function useCountries<T = Country[]>() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const result = await getAllCountriesAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data as T;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
