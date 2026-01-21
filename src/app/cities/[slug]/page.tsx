import React from "react";
import { getSession } from "@/lib/auth/get-current-user";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getCitiesWithCountry } from "@/lib/db/cityLocation.repo";
import Link from "next/link";
import Button from "@/app/components/common/Button";
import {
  Heart,
  Shield,
  Instagram,
  MapPin,
  Clock,
  Calendar,
  Users,
  FacebookIcon,
} from "lucide-react";
import { formatPopulation } from "@/app/_utils/formatNumber";
import { City } from "@/domain/city/city.schema";
import { AiFillTikTok } from "react-icons/ai";
import social from "@/data/social.json";
import { AiFillRedditCircle } from "react-icons/ai";
import HeroImage from "./_components/HeroImage";

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/signin");
  }

  const { slug } = await params;
  const city = (await getCitiesWithCountry(slug)) as unknown as City;

  if (!city) {
    return <div>City not found</div>;
  }

  // Helper to safely get country name
  const countryName = city.country?.name || "Unknown Country";

  return (
    <div className="bg-appbg min-h-screen font-sans selection:bg-brand selection:text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between">
        <Button
          variant="back"
          className="bg-gray-800/50 backdrop-blur-md text-white hover:bg-gray-800/70"
        />
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-md flex items-center justify-center hover:bg-gray-800/70 transition-colors">
            <Heart size={20} className="text-white" />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-md flex items-center justify-center hover:bg-gray-800/70 transition-colors">
            <Shield size={20} className="text-white" />
          </button>
          <Link
            href={`${social.filter((s) => s.name === "tiktok")[0].groupsURL}${city.name}`}
            target="_blank"
            className="w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-md flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <AiFillTikTok size={20} className="text-white" />
          </Link>
          <Link
            href={`${social.filter((s) => s.name === "facebook")[0].groupsURL}${city.name}`}
            target="_blank"
            className="w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-md flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <FacebookIcon size={20} className="text-white" />
          </Link>
          <Link
            href={`${social.filter((s) => s.name === "reddit")[0].groupsURL}${city.name} travel`}
            target="_blank"
            className="w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-md flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <AiFillRedditCircle size={20} className="text-white" />
          </Link>
          <Link
            href={`${social.filter((s) => s.name === "instagram")[0].groupsURL}${city.name}`}
            target="_blank"
            className="w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-md flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <Instagram size={20} className="text-white" />
          </Link>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="pt-24 px-4 max-w-md mx-auto min-h-screen flex flex-col gap-8">
        {/* Identity & Hero */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <HeroImage src={city?.imageHeroUrl} name={city.name} />
          <div className="text-center">
            <Link
              href={`/countries/${city.country?.cca3 || ""}`}
              className="text-brand text-sm uppercase tracking-wider font-bold hover:underline mb-1 inline-block"
            >
              {countryName}
            </Link>
            <h1 className="text-4xl font-bold font-sora flex items-center justify-center gap-2">
              {city.name}
              {city.isCapital && (
                <span className="text-yellow-400 text-2xl" title="Capital City">
                  👑
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between px-2 py-4 bg-surface/50 rounded-2xl backdrop-blur-sm border border-surface-secondary">
          <div className="text-center flex-1">
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg font-bold font-sora">
                {city.idealDuration || "3-4 days"}
              </span>
              <span className="text-[10px] text-secondary font-bold uppercase tracking-widest flex items-center gap-1">
                <Clock size={10} /> Duration
              </span>
            </div>
          </div>
          <div className="text-center flex-1 border-l border-r border-surface-secondary">
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg font-bold font-sora">
                {city.population ? formatPopulation(city.population) : "N/A"}
              </span>
              <span className="text-[10px] text-secondary font-bold uppercase tracking-widest flex items-center gap-1">
                <Users size={10} /> People
              </span>
            </div>
          </div>
          <div className="text-center flex-1">
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg font-bold font-sora capitalize truncate w-full px-1">
                {city.bestSeason || "Year-round"}
              </span>
              <span className="text-[10px] text-secondary font-bold uppercase tracking-widest flex items-center gap-1">
                <Calendar size={10} /> Season
              </span>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-2 h-48">
          <div className="relative rounded-2xl overflow-hidden bg-surface shadow-sm group">
            {city.media && city.media.length > 0 && city.media[0]?.url ? (
              <Image
                src={city.media[0].url}
                alt={`${city.name} highlight 1`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-secondary text-xs">
                No Image
              </div>
            )}
          </div>
          <div className="grid grid-rows-2 gap-2">
            <div className="relative rounded-2xl overflow-hidden bg-surface shadow-sm group">
              {city.media && city.media.length > 1 && city.media[1]?.url ? (
                <Image
                  src={city.media[1].url}
                  alt={`${city.name} highlight 2`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-secondary text-xs">
                  No Image
                </div>
              )}
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-surface shadow-sm group">
              {city.media && city.media.length > 2 && city.media[2]?.url ? (
                <Image
                  src={city.media[2].url}
                  alt={`${city.name} highlight 3`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-secondary text-xs">
                  No Image
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs / Navigation */}
        <div className="flex items-center gap-6 overflow-x-auto pb-2 no-scrollbar text-sm font-bold tracking-wide border-b border-surface-secondary">
          <span className="text-brand pb-2 border-b-2 border-brand cursor-pointer">
            TOP PLACES
          </span>
          <span className="text-secondary pb-2 cursor-pointer hover:text-app-text transition-colors whitespace-nowrap">
            INFO
          </span>
          <span className="text-secondary pb-2 cursor-pointer hover:text-app-text transition-colors whitespace-nowrap">
            NEIGHBORHOODS
          </span>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-6">
          {/* Top Places (reusing logic from cities list in country page) */}
          {city.places && city.places.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {city.places.slice(0, 4).map((place: any, i: number) => (
                <div
                  key={place.id || i}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-surface group shadow-md"
                >
                  {place.imageHeroUrl ? (
                    <Image
                      src={place.imageHeroUrl}
                      alt={place.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary bg-surface-secondary">
                      <MapPin size={24} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="font-bold text-white text-sm line-clamp-2">
                      {place.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-surface/50 rounded-2xl border border-dashed border-surface-secondary">
              <MapPin className="w-8 h-8 mx-auto text-secondary mb-2 opacity-50" />
              <p className="text-secondary italic text-sm">
                Top places coming soon
              </p>
            </div>
          )}

          {/* Info List */}
          <div className="flex flex-col gap-4 bg-surface/30 p-4 rounded-3xl">
            {/* Safety */}
            <div className="flex items-center justify-between py-2 border-b border-surface-secondary last:border-0">
              <span className="text-secondary font-bold text-sm uppercase tracking-wide">
                Safety
              </span>
              <span
                className={`font-bold text-sm px-3 py-1 rounded-full ${
                  !city.safety
                    ? "bg-gray-100 text-gray-500"
                    : city.safety.toLowerCase().includes("safe")
                      ? "bg-green-100 text-green-700"
                      : city.safety.toLowerCase().includes("caution")
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                }`}
              >
                {city.safety || "Unknown"}
              </span>
            </div>

            {/* Budget/Payment */}
            <div className="flex items-center justify-between py-2 border-b border-surface-secondary last:border-0">
              <span className="text-secondary font-bold text-sm uppercase tracking-wide">
                Daily Budget
              </span>
              <span className="text-app-text font-bold text-sm">
                {city.budget
                  ? `${city.budget.currency || "$"} ${city.budget.perDayMin}-${city.budget.perDayMax}`
                  : "N/A"}
              </span>
            </div>

            {/* Timezone */}
            <div className="flex items-center justify-between py-2 border-b border-surface-secondary last:border-0">
              <span className="text-secondary font-bold text-sm uppercase tracking-wide">
                Timezone
              </span>
              <span className="text-app-text font-bold text-sm">
                {city.timeZone || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
