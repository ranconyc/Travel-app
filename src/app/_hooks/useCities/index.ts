import { useQuery } from "@tanstack/react-query";
import { getAllCitiesAction } from "@/domain/city/city.actions";
import type { City } from "@/domain/city/city.schema";

export function useCities<T = City[]>() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await getAllCitiesAction(undefined);
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch cities");
      }
      return res.data as T;
    },
    staleTime: 1000 * 60 * 60, // 1 hour - cities don't change often
  });
}
