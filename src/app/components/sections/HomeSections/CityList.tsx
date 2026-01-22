"use client";

import React from "react";
import Link from "next/link";
import { useCities } from "@/domain/city/city.hooks";
import SectionHeader from "@/app/components/common/SectionHeader";
import HorizontalList from "@/app/components/common/HorizontalList";

export default function CityList() {
  const { data: cities, isLoading } = useCities();

  if (isLoading)
    return (
      <div className="animate-pulse h-24 bg-surface rounded-lg w-full"></div>
    );

  return (
    <div>
      <SectionHeader title="Cities" href="/cities" />
      <HorizontalList>
        {cities?.map((city) => (
          <Link
            key={city.id}
            href={`/cities/${city.cityId}`}
            className="min-w-[140px] group relative rounded-xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-md transition-all"
          >
            {city.imageHeroUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={city.imageHeroUrl}
                alt={city.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-surface-secondary flex flex-col items-center justify-center text-secondary p-2 text-center">
                <span className="font-bold text-lg">
                  {city.name.substring(0, 2).toUpperCase()}
                </span>
                <span className="text-[10px] mt-1 line-clamp-1">
                  {city.country?.code}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
              <span className="text-white font-bold text-sm truncate w-full">
                {city.name}
              </span>
            </div>
          </Link>
        ))}
        {(!cities || cities.length === 0) && (
          <div className="text-sm text-secondary italic p-4">
            No cities found.
          </div>
        )}
      </HorizontalList>
    </div>
  );
}
