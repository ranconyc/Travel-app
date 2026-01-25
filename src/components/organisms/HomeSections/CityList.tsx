"use client";

import React from "react";
import { useCities } from "@/domain/city/city.hooks";
import { useLocationStore } from "@/store/locationStore";
import SectionList from "@/components/molecules/SectionList";
import DestinationCard from "@/components/molecules/DestinationCard";

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
        <div className="min-w-[140px] aspect-4/3 animate-pulse bg-surface-secondary rounded-3xl" />
      }
      skeletonCount={6}
      emptyText="No cities found."
      renderItem={(city) => (
        <DestinationCard
          key={city.id}
          href={`/cities/${city.cityId}`}
          title={city.name}
          image={city.imageHeroUrl}
          className="min-w-[140px]"
        />
      )}
    />
  );
}
