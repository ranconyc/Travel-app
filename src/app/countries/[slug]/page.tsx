import { notFound } from "next/navigation";
import Header from "./components/Header";
import { FinanceSection } from "./components/FinanceSection";
import CultureSection from "./components/CultureSection";
import HealthSection from "./components/HealthSection";
import { getCountryWithCities } from "@/lib/db/country.repo";
import SocialLinks from "./components/SocialLinks";
import InfoSection from "./components/InfoSection";
import CitiesSection from "./components/CitiesSection";
import HeroImage from "@/components/molecules/HeroImage";
import Stats from "@/components/molecules/Stats";
import { StatItem } from "@/domain/common.schema";
import { Globe2, Users } from "lucide-react";
import { formatPopulation } from "@/domain/shared/utils/formatNumber";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import LogisticsSection from "./components/LogisticsSection";
import { Country } from "@/domain/country/country.schema";
import {
  estimateFlightTimeHoursFromDistance,
  getDistance,
} from "@/domain/shared/utils/geo";

import StateSection from "./components/StateSection";
import LanguageSection from "@/components/organisms/LanguageSection";
import Block from "@/components/atoms/Block";

// Business Logic: Gini Insights move to a helper or could be in the Mapper/Service
export const getGiniInsight = (giniValue: number): string => {
  if (giniValue < 30) return "High Social Equality";
  if (giniValue < 45) return "Moderate Wealth Gap";
  return "Significant Economic Contrast";
};

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const country = (await getCountryWithCities(slug)) as unknown as Country;
  const loggedUser = await getCurrentUser();

  if (!country) return notFound();

  // Geography & Logistics Logic
  const inThisCountry = loggedUser?.currentCity?.country?.id === country?.id;
  const userCoords = (loggedUser?.currentCity?.coords as any)?.coordinates;
  const countryCoords = (country.coords as any)?.coordinates;

  const distance =
    userCoords && countryCoords
      ? estimateFlightTimeHoursFromDistance(
          getDistance(
            userCoords[1],
            userCoords[0],
            countryCoords[1],
            countryCoords[0],
          ),
        )
      : "";

  const stats: StatItem[] = [
    {
      value: distance ? `~ ${distance}Hrs` : "N/A",
      label: "Away",
      icon: Globe2,
    },
    {
      value: formatPopulation(country.population || 0),
      label: "Population",
      icon: Users,
    },
    {
      value: country.areaKm2
        ? `${formatPopulation(country.areaKm2)} km²`
        : "N/A",
      label: "Area",
      icon: Globe2,
    },
  ];

  const hasStates = (country.states?.length || 0) > 0;

  // Handling Finance and Gini data from the unified domain schema
  const finance = (country.finance as any) || {};
  const giniValue = finance.giniIndex || null;

  return (
    <div className="bg-app-bg min-h-screen selection:bg-brand selection:text-white">
      <Header />
      <main className="pb-xxl px-lg max-w-2xl mx-auto min-h-screen flex flex-col gap-xxl">
        <div className="flex flex-col gap-lg mt-xl">
          <InfoSection
            title={country.name}
            subtitle={country.subRegion || country.region || ""}
          />

          {inThisCountry && (
            <div className="flex items-center gap-sm bg-brand/10 text-brand px-md py-xs rounded-full w-fit border border-brand/20 animate-fade-in shadow-sm">
              <Globe2 size={14} />
              <span className="text-upheader font-bold uppercase tracking-wider">
                You are in {country.name}
              </span>
            </div>
          )}

          <HeroImage
            src={
              country.imageHeroUrl ||
              (country.flags as any)?.svg ||
              (country.flags as any)?.png
            }
            name={country.name}
          />

          <SocialLinks query={country.name} />
        </div>

        <Stats stats={stats} />

        {hasStates ? (
          <StateSection country={country} />
        ) : (
          <CitiesSection country={country} />
        )}

        <div className="flex flex-col gap-lg">
          <div className="grid grid-cols-2 gap-md">
            {giniValue && (
              <Block>
                <h3 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-xs">
                  Social Equality
                </h3>
                <p className="text-p font-bold text-app-text">
                  {getGiniInsight(giniValue as number)}
                </p>
              </Block>
            )}

            {country.capitalName && (
              <Block>
                <h3 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-xs">
                  Capital
                </h3>
                <p className="text-p font-bold text-app-text">
                  {country.capitalName}
                </p>
              </Block>
            )}
          </div>

          <FinanceSection
            data={{
              currency: {
                symbol: finance.currency?.symbol || "$",
                name: finance.currency?.name || "USD",
              },
              budget: {
                daily: {
                  budget: finance.avgDailyCost?.budget?.toString() || "45",
                  mid: finance.avgDailyCost?.mid?.toString() || "100",
                  luxury: finance.avgDailyCost?.luxury?.toString() || "250",
                },
              },
              cashCulture: {
                cashPreferred: finance.cashCulture?.primaryPayment === "Cash",
              },
            }}
          />

          {country.languages && (
            <LanguageSection {...(country.languages as any)} />
          )}

          <LogisticsSection data={country.logistics as any} />
          <CultureSection />
          <HealthSection />
        </div>
      </main>
    </div>
  );
}
