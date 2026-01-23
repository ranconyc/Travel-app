import { notFound } from "next/navigation";
import Header from "./components/Header";
import HeaderWrapper from "@/app/components/common/Header";
import MediaGallery from "./components/MediaGallery";
import { SafetySection } from "./components/SafetySection";
import { FinanceSection } from "./components/FinanceSection";
import CultureSection from "./components/CultureSection";
import HealthSection from "./components/HealthSection";
import {
  getCountryWithCities,
  getCountriesByRegion,
} from "@/lib/db/country.repo";
import SocialLinks from "./components/SocialLinks";
import InfoSection from "./components/InfoSection";
import HeroImage from "@/app/components/common/HeroImage";
import Stats from "@/app/components/common/Stats";
import { StatItem } from "@/domain/common.schema";
import {
  DollarSign,
  FlashlightIcon,
  Globe2,
  LanguagesIcon,
  Users,
} from "lucide-react";
import { formatPopulation } from "@/app/_utils/formatNumber";
import { getDistance } from "@/app/_utils/geo";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import LogisticsSection from "./components/LogisticsSection";
import Link from "next/link"; // Added for Continent View

// Known continents for quick check
const CONTINENTS = ["africa", "americas", "asia", "europe", "oceania"];

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase();

  // 1. CONTINENT VIEW LOGIC
  if (CONTINENTS.includes(lowerSlug)) {
    const countries = await getCountriesByRegion(lowerSlug);

    // Capitalize for display
    const continentName =
      lowerSlug.charAt(0).toUpperCase() + lowerSlug.slice(1);

    return (
      <div className="bg-appbg min-h-screen font-sans selection:bg-brand selection:text-white pb-20">
        <HeaderWrapper backButton className="sticky top-0 z-50">
          <div className="mt-4">
            <p className="text-sm text-secondary uppercase tracking-wider font-medium">
              Explore Region
            </p>
            <h1 className="text-4xl font-bold font-sora text-app-text mt-1 mb-6">
              {continentName}
            </h1>
          </div>
        </HeaderWrapper>

        <main className="p-4">
          {countries.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {countries.map((country: any) => (
                <Link
                  key={country.id}
                  href={`/countries/${country.cca3}`}
                  className="group relative rounded-xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-md transition-all bg-surface border border-surface-secondary block"
                >
                  <HeroImage
                    src={
                      country.imageHeroUrl ||
                      (country.flags as any)?.svg ||
                      (country.flags as any)?.png
                    }
                    name={country.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-white font-bold text-lg truncate w-full group-hover:text-brand transition-colors">
                      {country.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-secondary">
              No countries found in this region.
            </div>
          )}
        </main>
      </div>
    );
  }

  // 2. COUNTRY DETAIL VIEW LOGIC
  const country = await getCountryWithCities(slug);
  const loggedUser = await getCurrentUser();

  // Handle case where country isn't found
  if (!country) return notFound();

  const inThisCountry = loggedUser?.currentCity?.country?.id === country?.id;

  const stats: StatItem[] = [
    {
      value: "12Hr",
      label: "Away",
      icon: Globe2,
    },
    {
      value: formatPopulation(country?.population || 9000000),
      label: "Population",
      icon: Users,
    },
    {
      value: `${country?.areaKm2 ? formatPopulation(country.areaKm2) : "N/A"} km²`,
      label: "Area",
      icon: Globe2,
    },
  ];

  return (
    <div className="bg-appbg min-h-screen font-sans selection:bg-brand selection:text-white">
      {/* Header */}
      <Header />
      <main className="pb-20 px-4 max-w-md mx-auto min-h-screen flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <InfoSection
            title={country.name}
            subtitle={country.subRegion || country.region || ""}
          />
          {inThisCountry && (
            <div className="flex items-center gap-2 bg-brand/10 text-brand px-3 py-1 rounded-full w-fit animate-fade-in border border-brand/20">
              <Globe2 size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">
                You are in {country.name}
              </span>
            </div>
          )}
          {/* Use country flag as fallback if hero image is missing */}
          <HeroImage
            src={
              country.imageHeroUrl ||
              (country.flags as { svg?: string; png?: string })?.svg ||
              (country.flags as { svg?: string; png?: string })?.png
            }
            name={country.name}
          />
          <SocialLinks query={country.name} />
        </div>
        <Stats stats={stats} />
        {/* {country?.media && (
          <MediaGallery country={country as any} />
        )} */}

        <div className="flex flex-col gap-4">
          <FinanceSection
            data={{
              currency: {
                symbol: (country?.finance as any)?.currency?.symbol,
                name: (country?.finance as any)?.currency?.name,
              },
              budget: {
                daily: { budget: "60-80", mid: "100-120", luxury: "200+" },
              },
              cashCulture: { cashPreferred: true },
            }}
          />
          <LogisticsSection />
          {/* <SafetySection /> */}
          {/* <LanguageSection data={country.languages as any} /> */}
          <CultureSection />
          <HealthSection />
        </div>
      </main>
    </div>
  );
}
