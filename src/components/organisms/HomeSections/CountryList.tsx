"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCountries } from "@/domain/country/country.hooks";
import { Country } from "@/domain/country/country.schema";
import Typography from "@/components/atoms/Typography";
import Card from "@/components/molecules/Card";

import { useAppStore } from "@/store/appStore";
import SectionList from "@/components/molecules/SectionList";

export default function CountryList() {
  const { coords } = useAppStore();
  const { data: countries, isLoading } = useCountries<Country[]>({
    coords: coords || undefined,
  });

  const getCountryImage = (country: Country) => {
    return (
      country.imageHeroUrl ??
      (country.flags as { svg?: string; png?: string })?.svg ??
      (country.flags as { svg?: string; png?: string })?.png
    );
  };

  return (
    <SectionList
      title="Countries"
      href="/countries"
      data={countries?.slice(0, 20)}
      isLoading={isLoading}
      emptyText="No countries found."
      renderItem={(country) => (
        <Link
          key={country.cca3}
          href={`/countries/${country.cca3.toLowerCase()}`}
          className="min-w-[232px] block"
        >
          <Card className="aspect-[4/3] relative group border-0">
            {getCountryImage(country) ? (
              <Image
                src={getCountryImage(country)!}
                alt={country.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
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
                  <Typography
                    variant="h2"
                    className="text-white drop-shadow-lg"
                  >
                    {country.code}
                  </Typography>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
              <Typography variant="upheader" className="text-white/80 mb-0.5">
                {country.region}
              </Typography>
              <Typography variant="h3" className="text-white truncate">
                {country.name}
              </Typography>
            </div>
          </Card>
        </Link>
      )}
    />
  );
}
