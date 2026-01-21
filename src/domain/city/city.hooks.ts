import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  generateCityAction,
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
