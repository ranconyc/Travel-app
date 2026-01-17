import { useQuery } from "@tanstack/react-query";
import { getAllCitiesAction } from "@/domain/city/city.actions";
export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await getAllCitiesAction();
      return res;
    },
    staleTime: 1000 * 60 * 60, // 1 hour - cities don't change often
  });
}
