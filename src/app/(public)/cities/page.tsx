"use client";

import HeaderWrapper from "@/components/molecules/Header";
import Input from "@/components/atoms/Input";
import { useCities } from "@/domain/city/city.hooks";
import { Search } from "lucide-react";

import Typography from "@/components/atoms/Typography";
import Loader from "@/components/atoms/Loader";
import CityCard from "@/components/molecules/CityCard";
import { City } from "@/domain/city/city.schema";

export default function CitiesPage() {
  const { filteredCities, isLoading, isSuccess, search, setSearch } =
    useCities();

  return (
    <div className="min-h-screen bg-main pb-20">
      <HeaderWrapper backButton className="sticky top-0 z-50">
        <div className="mt-md">
          <Typography variant="tiny" className="font-medium tracking-wider">
            Explore the
          </Typography>
          <Typography variant="h1" className="mt-1 mb-6 w-fit capitalize">
            Cities
          </Typography>
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

      <main className="p-md mt-md">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-md">
            <Loader />
            <Typography color="sec" className="animate-pulse">
              Loading amazing cities...
            </Typography>
          </div>
        ) : isSuccess && filteredCities && filteredCities.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
            {filteredCities.map((city: City) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-surface p-6 rounded-full mb-md shadow-sm border border-surface-secondary">
              <Search className="w-10 h-10 text-secondary opacity-20" />
            </div>
            <Typography variant="h3" className="w-fit capitalize">
              No cities found
            </Typography>
            <Typography color="sec" className="max-w-[240px] mt-2">
              {search
                ? `We couldn't find any results for "${search}". Try a different city?`
                : "No cities available in the database yet."}
            </Typography>
          </div>
        )}
      </main>
    </div>
  );
}
