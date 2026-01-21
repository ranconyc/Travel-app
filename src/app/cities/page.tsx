"use client";

import { useState } from "react";
import HeaderWrapper from "@/app/components/common/Header";
import Input from "@/app/components/form/Input";
import { useCities } from "@/app/_hooks/useCities";
import Link from "next/link";
import { City } from "@/domain/city/city.schema";
import { Loader2, Search, MapPin } from "lucide-react";

export default function CitiesPage() {
  const { data: cities, isLoading, isSuccess } = useCities();
  const [search, setSearch] = useState("");

  const filteredCities = cities?.filter(
    (city) =>
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.country?.name?.toLowerCase().includes(search.toLowerCase()) ||
      city.country?.code?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-app-bg pb-20">
      <HeaderWrapper backButton className="sticky top-0 z-50">
        <div className="mt-4">
          <p className="text-sm text-secondary uppercase tracking-wider font-medium">
            Explore the
          </p>
          <h1 className="text-4xl font-bold font-sora text-app-text mt-1 mb-6">
            Cities
          </h1>
          <div className="relative">
            <Input
              placeholder="Search cities..."
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
              Loading amazing cities...
            </p>
          </div>
        ) : isSuccess && filteredCities && filteredCities.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredCities.map((city: any) => (
              <Link
                key={city.id}
                href={`/cities/${city.cityId}`}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-surface border border-surface-secondary shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  {city.imageHeroUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={city.imageHeroUrl}
                      alt={city.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-secondary flex items-center justify-center">
                      <MapPin className="text-secondary w-8 h-8 opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 p-3 w-full">
                    <h2 className="text-white font-bold text-lg leading-tight group-hover:text-brand transition-colors">
                      {city.name}
                    </h2>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-white/70 text-[10px] uppercase tracking-wider font-medium">
                        {city.country?.name ||
                          city.country?.code ||
                          city.countryRefId}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-surface p-6 rounded-full mb-4 shadow-sm border border-surface-secondary">
              <Search className="w-10 h-10 text-secondary opacity-20" />
            </div>
            <h3 className="text-lg font-bold text-app-text">No cities found</h3>
            <p className="text-secondary max-w-[240px] mt-2">
              {search
                ? `We couldn't find any results for "${search}". Try a different city?`
                : "No cities available in the database yet."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
