import { useQuery } from "@tanstack/react-query";
import { getAllCountriesAction } from "@/domain/country/country.actions";

export function useCountries<T>() {
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
