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
              href={`/countries/${country.cca3.toLowerCase()}`}
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
                  <div className="w-full h-full relative">
                    <Image
                      src={`https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop&sig=${country.name}`}
                      alt={`${country.name} placeholder`}
                      fill
                      className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <span className="text-xl font-bold text-white drop-shadow-lg">
                        {country.code}
                      </span>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                  <div className="text-xs uppercase font-bold tracking-wider text-white/80">
                    {country.region}
                  </div>
                  <span className="text-white font-bold text-xl truncate w-full">
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
