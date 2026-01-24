"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCountries } from "@/domain/country/country.hooks";
import { Country } from "@/domain/country/country.schema";
import SectionHeader from "@/app/components/common/SectionHeader";
import HorizontalList from "@/app/components/common/HorizontalList";

export default function CountryList({
  coords,
}: {
  coords?: { lat: number; lng: number };
}) {
  const { data: countries, isLoading } = useCountries<Country[]>({
    coords,
  });

  const hasImage = (country: Country) => {
    return (
      country.imageHeroUrl ||
      (country.flags as { svg?: string; png?: string })?.svg ||
      (country.flags as { svg?: string; png?: string })?.png
    );
  };

  const getCountryImage: (country: Country) => string | undefined = (
    country: Country,
  ) => {
    return (
      country.imageHeroUrl ??
      (country.flags as { svg?: string; png?: string })?.svg ??
      (country.flags as { svg?: string; png?: string })?.png
    );
  };

  return (
    <div>
      <SectionHeader title="Countries" href="/countries" />
      <HorizontalList noScrollbar>
        {isLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[232px] min-h-[174px] aspect-[4/3] animate-pulse h-24 bg-surface-secondary rounded-xl w-full"
              ></div>
            ))}
          </>
        ) : (
          countries?.slice(0, 20).map((country) => (
            <Link
              key={country.cca3}
              href={`/countries/${country.cca3}`}
              className="min-w-[232px] group relative rounded-xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-md transition-all"
            >
              <div className="bg-white w-full h-full relative">
                {hasImage(country) ? (
                  <Image
                    src={getCountryImage(country)!}
                    alt={country.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-secondary flex items-center justify-center text-secondary font-bold text-lg">
                    {country.code}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <span className="text-white font-bold text-sm truncate w-full">
                    {country.name}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
        {(!countries || countries.length === 0 || isLoading) && (
          <div className="text-sm text-secondary italic p-4">
            No countries found.
          </div>
        )}
      </HorizontalList>
    </div>
  );
}
