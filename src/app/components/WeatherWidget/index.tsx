"use client";

import React from "react";
import * as Icons from "lucide-react";
import { useWeather } from "./useWeather";
import { weatherCodeMap } from "./weather.service";

export default function WeatherWidget({
  lat,
  lng,
}: {
  lat?: number;
  lng?: number;
}) {
  const { data, isLoading, isError } = useWeather(lat, lng);

  if (isLoading) {
    return (
      <div className="min-w-[70px] flex items-center justify-center gap-2 bg-surface rounded-full px-2 py-1.5 animate-pulse">
        <div className="w-4 h-4 bg-secondary/20 rounded-full" />
        <div className="w-8 h-4 bg-secondary/20 rounded-md" />
      </div>
    );
  }

  if (isError || !data) return null;

  const weatherInfo = weatherCodeMap[data.weatherCode] || weatherCodeMap[0];
  const Icon =
    (Icons as unknown as Record<string, React.ElementType>)[weatherInfo.icon] ||
    Icons.Sun;

  return (
    <div
      className="min-w-fit flex items-center gap-2 bg-surface rounded-full px-2 py-1.5 border border-surface-secondary shadow-sm"
      title={weatherInfo.label}
    >
      <Icon className="w-4 h-4 text-brand" />
      <span className="text-sm font-bold text-app-text">
        {Math.round(data.temperature)}°C
      </span>
    </div>
  );
}
