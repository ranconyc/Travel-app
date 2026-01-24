"use client";

import HeaderWrapper from "@/components/molecules/Header";
import Link from "next/link";
import { Globe } from "lucide-react";

const CONTINENTS = [
  {
    name: "Africa",
    slug: "africa",
    color: "from-yellow-400 to-orange-500",
    icon: "🌍",
  },
  {
    name: "Americas",
    slug: "americas",
    color: "from-green-400 to-emerald-500",
    icon: "🌎",
  },
  {
    name: "Asia",
    slug: "asia",
    color: "from-red-400 to-rose-500",
    icon: "🌏",
  },
  {
    name: "Europe",
    slug: "europe",
    color: "from-blue-400 to-indigo-500",
    icon: "🌍",
  },
  {
    name: "Oceania",
    slug: "oceania",
    color: "from-cyan-400 to-blue-500",
    icon: "🌏",
  },
];

export default function CountriesPage() {
  return (
    <div className="min-h-screen bg-main pb-20">
      <HeaderWrapper backButton className="sticky top-0 z-50">
        <div className="mt-md">
          <p className="text-sm text-secondary uppercase tracking-wider font-medium">
            Explore by
          </p>
          <h1 className="text-h1 font-bold font-sora text-txt-main mt-1 mb-6">
            Continent
          </h1>
        </div>
      </HeaderWrapper>

      <main className="p-md mt-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {CONTINENTS.map((continent) => (
            <Link
              key={continent.slug}
              href={`/continents/${continent.slug}`}
              className="group relative h-40 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all block"
            >
              {/* Animated Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${continent.color} opacity-80 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-between p-8">
                <div>
                  <h2 className="text-3xl font-bold text-white font-sora">
                    {continent.name}
                  </h2>
                  <p className="text-white/80 font-medium mt-1 flex items-center gap-1">
                    Explore region <Globe className="w-4 h-4 opacity-70" />
                  </p>
                </div>
                <span className="text-6xl filter drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">
                  {continent.icon}
                </span>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
