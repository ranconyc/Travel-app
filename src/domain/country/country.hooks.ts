import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  generateCountryAction,
  getAllCountriesAction,
  GenerateCountryResult,
} from "@/domain/country/country.actions";
import { Country } from "@/domain/country/country.schema";
import { ActionResponse } from "@/types/actions";

export function useGenerateCountry() {
  const queryClient = useQueryClient();

  return useMutation<ActionResponse<GenerateCountryResult>, Error, string>({
    mutationFn: async (name: string) => await generateCountryAction({ name }),
    onSuccess: (res: ActionResponse<GenerateCountryResult>) => {
      if (res.success) {
        const data = res.data;
        if (data.created) {
          console.log(`Generated ${data.name}`);
        } else {
          console.log(`${data.name} already exists`);
        }
        // Invalidate country lists so UI updates
        queryClient.invalidateQueries({ queryKey: ["countries"] });
        // Also maybe specific country query if needed
        if (data.cca3) {
          queryClient.invalidateQueries({
            queryKey: ["country", data.cca3],
          });
        }
      }
    },
    onError: (err) => {
      console.error(err.message);
    },
  });
}

export function useCountries<T = Country[]>() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const result = await getAllCountriesAction(undefined);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data as T;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
