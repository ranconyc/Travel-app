import { useQuery } from "@tanstack/react-query";
import { getAllCountriesAction } from "@/app/actions/locationActions";

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: () => getAllCountriesAction(),
  });
}
