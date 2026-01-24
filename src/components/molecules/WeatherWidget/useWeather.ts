"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWeather, WeatherData } from "./weather.service";

export function useWeather(lat?: number, lng?: number) {
  return useQuery<WeatherData>({
    queryKey: ["weather", lat, lng],
    queryFn: () => {
      if (lat === undefined || lng === undefined) {
        throw new Error("Coordinates are required for weather fetch");
      }
      return fetchWeather(lat, lng);
    },
    enabled: lat !== undefined && lng !== undefined,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}
