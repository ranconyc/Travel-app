import { useQuery } from "@tanstack/react-query";
import { getAllCitiesAction } from "@/domain/city/city.actions";
export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await getAllCitiesAction();
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour - cities don't change often
  });
}
