import { Country } from "@/domain/country/country.schema";
import {
  findBorderCountries,
  getCountryWithCities,
} from "@/lib/db/country.repo";
import Image from "next/image";
import { notFound } from "next/navigation";
import Logo from "@/app/components/common/Logo";
import Button from "@/app/components/common/Button";
import Link from "next/link";
import {
  Heart,
  Shield,
  Instagram,
  Plane,
  Users,
  Sun,
  MapPin,
  ChevronRight,
  Info,
} from "lucide-react";
import { formatPopulation } from "@/app/_utils/formatNumber";

export default async function CountryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const country = (await getCountryWithCities(slug)) as unknown as Country & {
    cities: any[];
  };

  if (!country) {
    notFound();
  }

  const borderCountries =
    country?.meta && (country.meta as any)?.borders
      ? await findBorderCountries((country.meta as any).borders)
      : [];

  const season = country.bestSeason || "Year-round";

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
          {country.cities?.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {country.cities.slice(0, 3).map((city: any) => (
                <div
                  key={city.cityId}
                  className="w-32 flex-shrink-0 relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-800 group"
                >
                  {city.images?.[0] && (
                    <Image
                      src={city.images[0]}
                      alt={city.name}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                    <span className="font-bold text-sm">{city.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 italic text-sm">
              Explore cities coming soon
            </div>
          )}

          {/* Info List */}
          <div className="flex flex-col gap-4">
            {/* Safety */}
            <div className="flex items-center justify-between group cursor-pointer">
              <span className="text-gray-300 font-bold text-sm uppercase tracking-wide">
                Safety
              </span>
              <div className="flex items-center gap-2">
                <span className="text-brand font-bold text-sm">
                  {country.safety || "Moderate"}
                </span>
              </div>
            </div>

            {/* Money */}
            <div className="flex items-center justify-between group cursor-pointer">
              <span className="text-gray-300 font-bold text-sm uppercase tracking-wide">
                Money
              </span>
              {country.currency && (
                <span className="text-gray-500 font-bold text-sm text-right">
                  {Object.values(country.currency)
                    .map((c: any) => c.name)
                    .join(", ")}
                </span>
              )}
            </div>

            {/* Payment */}
            <div className="flex items-center justify-between group cursor-pointer">
              <span className="text-gray-300 font-bold text-sm uppercase tracking-wide">
                Payment Method
              </span>
              <span className="text-gray-500 font-bold text-sm">
                Cash / Card
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
