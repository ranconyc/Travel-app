import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  generateCityAction,
  getAllCitiesAction,
  GenerateCityResult,
} from "@/domain/city/city.actions";
import { ActionResponse } from "@/types/actions";

export function useGenerateCity() {
  const queryClient = useQueryClient();

  return useMutation<
    ActionResponse<GenerateCityResult>,
    Error,
    { cityName: string; countryCode?: string }
  >({
    mutationFn: async ({ cityName, countryCode }) => {
      return await generateCityAction({ cityName, countryCode });
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["cities"] });
        if (res.data.countryCode) {
          queryClient.invalidateQueries({
            queryKey: ["country", res.data.countryCode],
          });
        }
      }
    },
  });
}

export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await getAllCitiesAction(undefined);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.error);
    },
  });
}
