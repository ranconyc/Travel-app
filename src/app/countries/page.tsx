"use client";

import { useState } from "react";
import HeaderWrapper from "@/app/components/common/Header";
import Input from "@/app/components/form/Input";
import { useCountries } from "@/app/_hooks/useCountries";
import Link from "next/link";
import { Loader2, Search, Map } from "lucide-react";

export default function CountriesPage() {
  const { data: countries, isLoading, isSuccess } = useCountries();
  const [search, setSearch] = useState("");

  const filteredCountries = countries?.filter(
    (country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-app-bg pb-20">
      <HeaderWrapper backButton className="sticky top-0 z-50">
        <div className="mt-4">
          <p className="text-sm text-secondary uppercase tracking-wider font-medium">
            Find your next
          </p>
          <h1 className="text-4xl font-bold font-sora text-app-text mt-1 mb-6">
            Destination
          </h1>
          <div className="relative">
            <Input
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
          </div>
        </div>
      </HeaderWrapper>

      <main className="p-4 mt-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
            <p className="text-secondary animate-pulse">
              Loading destinations...
            </p>
          </div>
        ) : isSuccess && filteredCountries && filteredCountries.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCountries.map((country) => (
              <Link
                key={country.id}
                href={`/countries/${country.countryId}`}
                className="group relative rounded-xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-md transition-all bg-surface border border-surface-secondary block"
              >
                {country.imageHeroUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={country.imageHeroUrl}
                    alt={country.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-secondary flex items-center justify-center text-secondary font-bold text-2xl">
                    {country.code}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
                  <span className="text-white font-bold text-lg truncate w-full group-hover:text-brand transition-colors">
                    {country.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-surface p-6 rounded-full mb-4 shadow-sm border border-surface-secondary">
              <Map className="w-10 h-10 text-secondary opacity-20" />
            </div>
            <h3 className="text-lg font-bold text-app-text">
              No countries found
            </h3>
            <p className="text-secondary max-w-[240px] mt-2">
              {search
                ? `We couldn't find matches for "${search}".`
                : "No countries available yet."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
