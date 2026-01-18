import { Country } from "@/domain/country/country.schema";
import { findBorderCountries } from "@/lib/db/country.repo";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Heart, Shield, Instagram, MapPin, Info } from "lucide-react";
import { formatPopulation } from "@/app/_utils/formatNumber";
import { SafetySection } from "@/app/countries/_components/SafetySection";
import { MoneySection } from "@/app/countries/_components/MoneySection";
import { LanguageSection } from "@/app/countries/_components/LanguageSection";
import thailand from "@/data/country.json";
import Button from "@/app/components/common/Button";

export default async function CountryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  // const country = (await getCountryWithCities(slug)) as unknown as Country & {
  //   cities: any[];
  // };

  const country = thailand as unknown as Country;

  if (!country) {
    notFound();
  }

  const borderCountries =
    country?.meta && (country.meta as any)?.borders
      ? await findBorderCountries((country.meta as any).borders)
      : [];

  const season =
    (typeof country.bestTimeToVisit === "string"
      ? country.bestTimeToVisit
      : (country.bestTimeToVisit as any)?.peak?.months?.join(", ")) ||
    "Year-round";

  return (
    <div className="bg-appbg min-h-screen font-sans selection:bg-brand selection:text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between">
        <Button
          variant="back"
          className="bg-gray-800/50 backdrop-blur-md text-white hover:bg-gray-800"
        />
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-md flex items-center justify-center hover:bg-gray-800 transition-colors">
            <Heart size={20} className="text-white" />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-md flex items-center justify-center hover:bg-gray-800 transition-colors">
            <Shield size={20} className="text-white" />
          </button>
          <Link
            href={`https://instagram.com/explore/tags/${country.countryId}`}
            target="_blank"
            className="w-10 h-10 rounded-full bg-gray-800/50 backdrop-blur-md flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <Instagram size={20} className="text-white" />
          </Link>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="pb-10 pt-20 px-4 max-w-md mx-auto min-h-screen flex flex-col gap-8">
        {/* Identity & Map/Hero */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="relative w-full aspect-[4/3]">
            {/* In a real app, this would be a map cutout. Using Hero image with mask-like effect or just standardized display as fallback */}
            {country.imageHeroUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={country.imageHeroUrl}
                  alt={country.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-app-bg rounded-3xl">
                <span className="text-6xl font-bold ">{country.code}</span>
              </div>
            )}
            {/* Sparkle decoration */}
            <div className="absolute bottom-4 right-4 text-gray-500 opacity-50">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L14.39 9.61L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.61L12 2Z" />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-gray-400 text-sm uppercase tracking-wider font-medium">
              {country.subRegion || country.continent}
            </h2>
            <h1 className="text-3xl font-bold mt-1 flex items-center justify-center gap-2">
              {country.name}
              {/* Flag emoji if possible, else empty */}
              {country.meta && (country.meta as any).flag ? (
                <span className="text-2xl">{(country.meta as any).flag}</span>
              ) : null}
            </h1>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between px-2">
          <div className="text-center">
            <div className="text-lg font-bold flex flex-col">
              <span>12hr</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                Flight
              </span>
            </div>
          </div>
          <div className="text-center border-l border-r border-gray-800 px-8">
            <div className="text-lg font-bold flex flex-col">
              <span>{formatPopulation(country.population)}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                Travelers
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold flex flex-col">
              <span className="capitalize">{season.split(" ")[0]}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                Season
              </span>
            </div>
          </div>
        </div>

        {/* Gallery / Highlights */}
        <div className="grid grid-cols-2 gap-2 h-48">
          <div className="relative rounded-2xl overflow-hidden bg-gray-800">
            {country.media &&
            country.media.length > 0 &&
            country.media[0]?.url ? (
              <Image
                src={country.media[0].url}
                alt="Highlight 1"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface text-secondary">
                <span className="text-xs">No Image</span>
              </div>
            )}
          </div>
          <div className="grid grid-rows-2 gap-2">
            <div className="relative rounded-2xl overflow-hidden bg-gray-800">
              {country.media &&
              country.media.length > 1 &&
              country.media[1]?.url ? (
                <Image
                  src={country.media[1].url}
                  alt="Highlight 2"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center  bg-surface">
                  <span className="text-xs">No Image</span>
                </div>
              )}
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-gray-800">
              {country.media &&
              country.media.length > 2 &&
              country.media[2]?.url ? (
                <Image
                  src={country.media[2].url}
                  alt="Highlight 3"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface">
                  <span className="text-xs">No Image</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs / Navigation */}
        <div className="flex items-center gap-6 overflow-x-auto pb-2 no-scrollbar text-sm font-bold tracking-wide border-b border-gray-800">
          <span className="text-white pb-2 border-b-2 border-white cursor-pointer">
            CITIES
          </span>
          <span className="text-gray-500 pb-2 cursor-pointer hover:text-gray-300">
            BORDER COUNTRIES
          </span>
          <span className="text-gray-500 pb-2 cursor-pointer hover:text-gray-300 whitespace-nowrap">
            HIDDEN GEMS
          </span>
        </div>

        {/* Content List - Cities & Info */}
        <div className="flex flex-col gap-6">
          {/* Cities Cards */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold font-sora">Popular Cities</h3>
            {country.cities && country.cities.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {country.cities.slice(0, 5).map((city: any) => (
                  <Link
                    href={`/cities/${city.cityId}`}
                    key={city.cityId}
                    className="min-w-[140px] w-[140px] flex-shrink-0 relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800 group shadow-lg"
                  >
                    {city.images?.[0] || city.imageHeroUrl ? (
                      <Image
                        src={city.images?.[0] || city.imageHeroUrl}
                        alt={city.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                        <MapPin className="text-gray-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-4">
                      <span className="font-bold text-white text-md leading-tight">
                        {city.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-surface/30 rounded-2xl border border-dashed border-surface-secondary">
                <MapPin className="w-8 h-8 mx-auto text-secondary mb-2 opacity-50" />
                <p className="text-secondary italic text-sm">
                  Explore cities coming soon
                </p>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-surface-secondary to-transparent" />

          {/* Rich Information Sections */}
          <div className="flex flex-col gap-8">
            <SafetySection data={country.safety as any} />
            <MoneySection data={country as any} />
            <LanguageSection data={country as any} />
          </div>

          {/* Fallback for missing data */}
          {!country.safety && !country.budget && !country.languages && (
            <div className="p-6 bg-surface/30 rounded-2xl border border-surface-secondary text-center">
              <Info className="w-8 h-8 mx-auto text-secondary mb-3" />
              <p className="text-secondary text-sm">
                Detailed travel information for {country.name} is being
                gathered. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
