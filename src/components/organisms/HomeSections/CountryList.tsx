"use client";

import React from "react";
import { useCountries } from "@/domain/country/country.hooks";
import { Country } from "@/domain/country/country.schema";
import DestinationCard from "@/components/molecules/DestinationCard";

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
        <DestinationCard
          key={country.cca3}
          href={`/countries/${country.cca3.toLowerCase()}`}
          title={country.name}
          subtitle={country.region || undefined}
          image={getCountryImage(country) || undefined}
          className="min-w-[232px]"
        />
      )}
    />
  );
}
