"use client";

import React from "react";
import Link from "next/link";
import { useCities } from "@/domain/city/city.hooks";
import Image from "next/image";
import { useAppStore } from "@/store/appStore";
import SectionList from "@/components/molecules/SectionList";
import Typography from "@/components/atoms/Typography";
import Card from "@/components/molecules/Card";

export default function CityList() {
  const { coords } = useAppStore();
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
        <div className="min-w-[140px] aspect-[4/3] animate-pulse bg-surface-secondary rounded-3xl" />
      }
      skeletonCount={6}
      emptyText="No cities found."
      renderItem={(city) => (
        <Link
          key={city.id}
          href={`/cities/${city.cityId}`}
          className="min-w-[140px] block"
        >
          <Card className="aspect-[4/3] relative group border-0">
            {city.imageHeroUrl ? (
              <Image
                src={city.imageHeroUrl}
                alt={city.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full relative">
                <Image
                  src={`https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop&keywords=city,${city.name}`}
                  alt={`${city.name} placeholder`}
                  fill
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Typography
                    variant="h3"
                    className="text-white drop-shadow-lg"
                  >
                    {city.name.substring(0, 2).toUpperCase()}
                  </Typography>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end p-3">
              <Typography
                variant="h4"
                className="text-white text-sm truncate w-full"
              >
                {city.name}
              </Typography>
            </div>
          </Card>
        </Link>
      )}
    />
  );
}
