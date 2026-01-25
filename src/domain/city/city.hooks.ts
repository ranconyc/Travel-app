"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { City } from "./city.schema";

async function getCities(): Promise<City[]> {
  const res = await fetch("/api/cities");
  if (!res.ok) {
    throw new Error("Failed to fetch cities");
  }
  return res.json();
}

export function useCities() {
  const { data: cities, ...queryInfo } = useQuery<City[]>({
    queryKey: ["cities"],
    queryFn: getCities,
  });
  const [search, setSearch] = useState("");

  const filteredCities = cities?.filter(
    (city) =>
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.country?.name?.toLowerCase().includes(search.toLowerCase()) ||
      city.country?.code?.toLowerCase().includes(search.toLowerCase()),
  );

  return {
    ...queryInfo,
    cities,
    search,
    setSearch,
    filteredCities,
  };
}
