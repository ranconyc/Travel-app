"use client";

import Link from "next/link";
import HeaderWrapper from "@/components/molecules/Header";
import { CONTINENTS } from "@/data/continents";

import Typography from "@/components/atoms/Typography";

import ContinentCard from "@/components/molecules/ContinentCard";
import { Globe, List } from "lucide-react";

export default function CountriesPage() {
  return (
    <div className="min-h-screen bg-main pb-20">
      <HeaderWrapper backButton className="sticky top-0 z-50">
        <div className="mt-md">
          <Typography variant="tiny" className="font-medium tracking-wider">
            Explore by
          </Typography>
          <Typography variant="h1" className="mt-1 mb-6 w-fit capitalize">
            Continent
          </Typography>
        </div>
      </HeaderWrapper>

      <main className="p-md mt-md">
        {/* Quick Actions */}
        <div className="mb-6">
          <Link
            href="/countries/index"
            className="flex items-center gap-3 p-4 bg-surface rounded-2xl hover:bg-surface-secondary transition-colors"
          >
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
              <List className="w-5 h-5 text-brand" />
            </div>
            <div className="flex-1">
              <Typography variant="h3" className="font-semibold text-txt-main">
                All Countries & Borders
              </Typography>
              <Typography variant="body-sm" color="sec">
                View complete list with bordering countries
              </Typography>
            </div>
          </Link>
        </div>

        {/* Continents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {CONTINENTS.map((continent) => (
            <ContinentCard key={continent.slug} continent={continent} />
          ))}
        </div>
      </main>
    </div>
  );
}
