"use client";

import React from "react";
import { useCities } from "@/domain/city/city.hooks";
import { useLocationStore } from "@/store/locationStore";
import SectionList from "@/components/molecules/SectionList";
import CityCard from "@/components/molecules/CityCard";

export default function CityList() {
  const { getFinalLocation } = useLocationStore();
  const coords = getFinalLocation();
  const { data: cities, isLoading } = useCities({
    coords: coords || undefined,
  });

  return (
    <SectionList
      title="Cities"
      href="/cities"
      data={cities}
      isLoading={isLoading}
      skeleton={
        <div className="min-w-[232px] aspect-4/3 animate-pulse bg-surface-secondary rounded-2xl" />
      }
      skeletonCount={6}
      emptyText="No cities found."
      renderItem={(city) => (
        <CityCard
          key={city.id}
          city={city}
        />
      )}
    />
  );
}
