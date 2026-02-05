"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { City } from "./city.schema";
import {
  generateCityAction,
  GenerateCityResult,
  getAllCitiesAction,
  getNearbyCitiesAction,
} from "@/domain/city/city.actions";
import { ActionResponse } from "@/types/actions";

// Generate a new city
export function useGenerateCity() {
  const queryClient = useQueryClient();

  return useMutation<
    ActionResponse<GenerateCityResult>,
    Error,
    { cityName: string; countryCode?: string }
  >({
    mutationFn: async ({ cityName, countryCode }) =>
      await generateCityAction({ cityName, countryCode }),
    onSuccess: (res: ActionResponse<GenerateCityResult>) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["cities"] });
      }
    },
    onError: (err) => {
      console.error(err.message);
    },
  });
}

// Get all cities
export function useCities(options?: { coords?: { lat: number; lng: number } }) {
  const { data, ...queryInfo } = useQuery<City[]>({
    queryKey: ["cities", options?.coords],
    queryFn: async (): Promise<City[]> => {
      const result = options?.coords
        ? await getNearbyCitiesAction({
            ...options.coords,
            km: 500,
            limit: 20,
          })
        : await getAllCitiesAction({ limit: 20 });

      if (result.success) {
        return (result.data || []) as unknown as City[];
      }
      throw new Error(result.error || "Failed to fetch cities");
    },
  });
  const [search, setSearch] = useState("");

  const filteredCities = (data || []).filter((city: City) => {
    const cityName = city.name.toLowerCase();
    const searchVal = search.toLowerCase();
    const country = city.country as
      | { name?: string; code?: string }
      | undefined;

    return (
      cityName.includes(searchVal) ||
      country?.name?.toLowerCase().includes(searchVal) ||
      country?.code?.toLowerCase().includes(searchVal)
    );
  });

  return {
    ...queryInfo,
    data,
    cities: data,
    search,
    setSearch,
    filteredCities,
  };
}
