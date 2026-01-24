import { notFound } from "next/navigation";
import Header from "./components/Header";
import { FinanceSection } from "./components/FinanceSection";
import CultureSection from "./components/CultureSection";
import HealthSection from "./components/HealthSection";
import { getCountryWithCities } from "@/lib/db/country.repo";
import SocialLinks from "./components/SocialLinks";
import InfoSection from "./components/InfoSection";
import CitiesSection from "./components/CitiesSection";
import HeroImage from "@/app/components/common/HeroImage";
import Stats from "@/app/components/common/Stats";
import { StatItem } from "@/domain/common.schema";
import { Globe2, Users } from "lucide-react";
import { formatPopulation } from "@/app/_utils/formatNumber";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import LogisticsSection from "./components/LogisticsSection";
import { Country } from "@/domain/country/country.schema";
import {
  estimateFlightTimeHoursFromDistance,
  getDistance,
} from "@/app/_utils/geo";

import StateSection from "./components/StateSection";

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 2. COUNTRY DETAIL VIEW LOGIC
  const country = await getCountryWithCities(slug);
  const loggedUser = await getCurrentUser();

  // Handle case where country isn't found
  if (!country) return notFound();

  const inThisCountry = loggedUser?.currentCity?.country?.id === country?.id;
  const userCoords = (loggedUser?.currentCity?.coords as any)?.coordinates;
  const countryCoords = (country.coords as any)?.coordinates;
  const distance = userCoords
    ? estimateFlightTimeHoursFromDistance(
        getDistance(
          userCoords[0],
          userCoords[1],
          countryCoords?.[0],
          countryCoords?.[1],
        ),
      )
    : "";

  console.log("distance", distance);
  const stats: StatItem[] = [
    {
      value: distance === 1 ? "~ " + distance + "Hr" : "~ " + distance + "Hrs",
      label: "Away",
      icon: Globe2,
    },
    {
      value: formatPopulation(country?.population || 9000000),
      label: "Population",
      icon: Users,
    },
    {
      value: `${country?.areaKm2 ? formatPopulation(country.areaKm2) : "N/A"}m²`,
      label: "Area",
      icon: Globe2,
    },
  ];

  const hasStates = (country?.states?.length || 0) > 0;

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

        {hasStates ? (
          <StateSection country={country as unknown as Country} />
        ) : (
          <CitiesSection country={country as unknown as Country} />
        )}

        <div className="flex flex-col gap-4">
          <FinanceSection
            data={{
              currency: {
                symbol:
                  (country?.finance as { currency?: { symbol?: string } })
                    ?.currency?.symbol || "$",
                name:
                  (country?.finance as { currency?: { name?: string } })
                    ?.currency?.name || "USD",
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
