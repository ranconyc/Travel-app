import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  generateCityAction,
  getAllCitiesAction,
  getNearbyCitiesAction,
  GenerateCityResult,
} from "@/domain/city/city.actions";
import { ActionResponse } from "@/types/actions";
import { City } from "@/domain/city/city.schema";

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

export function useCities(options?: {
  initialData?: City[];
  coords?: { lat: number; lng: number };
}) {
  return useQuery({
    queryKey: ["cities", options?.coords],
    queryFn: async () => {
      if (options?.coords) {
        const res = await getNearbyCitiesAction({
          lat: options.coords.lat,
          lng: options.coords.lng,
          km: 500,
          limit: 20,
        });
        if (res.success) {
          return res.data as unknown as City[];
        }
      }

      const res = await getAllCitiesAction({ limit: 20 });
      if (res.success) {
        return res.data as unknown as City[];
      }
      throw new Error(res.error);
    },
    initialData: options?.initialData,
  });
}
