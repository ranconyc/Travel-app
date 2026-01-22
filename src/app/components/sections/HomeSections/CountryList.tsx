"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCountries } from "@/domain/country/country.hooks";
import { Country } from "@/domain/country/country.schema";
import SectionHeader from "@/app/components/common/SectionHeader";
import HorizontalList from "@/app/components/common/HorizontalList";

export default function CountryList() {
  const { data: countries, isLoading } = useCountries<Country[]>();

  if (isLoading)
    return (
      <div className="animate-pulse h-24 bg-surface rounded-lg w-full"></div>
    );

  return (
    <div>
      <SectionHeader title="Countries" href="/countries" />
      <HorizontalList>
        {countries?.map((country) => (
          <Link
            key={country.cca3}
            href={`/countries/${country.cca3}`}
            className="min-w-[140px] group relative rounded-xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-md transition-all"
          >
            <div className="bg-white w-full h-full relative">
              {country.imageHeroUrl ? (
                <Image
                  src={country.imageHeroUrl}
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
        ))}
        {(!countries || countries.length === 0) && (
          <div className="text-sm text-secondary italic p-4">
            No countries found.
          </div>
        )}
      </HorizontalList>
    </div>
  );
}
