"use client";

import { Sun } from "lucide-react";

export default function WeatherWidget() {
  return (
    <div className="min-w-fit flex items-center gap-2 bg-surface rounded-full px-2 py-1.5">
      <Sun className="w-5 h-5 text-yellow-500" />
      <h1 className="text-sm font-medium">25°C</h1>
    </div>
  );
}
