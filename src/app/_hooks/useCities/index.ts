import { useQuery } from "@tanstack/react-query";
import { getAllCitiesAction } from "@/app/actions/locationActions";
export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: () => getAllCitiesAction(),
    staleTime: 1000 * 60 * 60, // 1 hour - cities don't change often
  });
}
