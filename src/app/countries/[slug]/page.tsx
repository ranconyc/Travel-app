import { notFound } from "next/navigation";
import { FinanceSection } from "./components/FinanceSection";
import CultureSection from "./components/CultureSection";
import HealthSection from "./components/HealthSection";
import { getCountryWithCities } from "@/lib/db/country.repo";
import SocialLinks from "./components/SocialLinks";
import PageInfo from "@/components/molecules/PageInfo";
import CitiesSection from "./components/CitiesSection";
import HeroImage from "@/components/molecules/HeroImage";
import Stats from "@/components/molecules/Stats";
import { StatItem } from "@/domain/common.schema";
import { Globe2, Users } from "lucide-react";
import { formatPopulation } from "@/domain/shared/utils/formatNumber";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import LogisticsSection from "./components/LogisticsSection";
import { Country } from "@/domain/country/country.schema";
import { getDistanceMetadata } from "@/domain/shared/utils/geo";
import StateSection from "./components/StateSection";
import LanguageSection from "@/components/organisms/LanguageSection";
import Block from "@/components/atoms/Block";
import FloatingCardList from "@/components/molecules/FloatingCardList";
import VisaRequirement from "@/components/molecules/VisaRequirement";
import { type VisaRequirement as VisaRequirementType } from "@/types/visa.types";
import { visaService } from "@/services/visa.service";

import commonPhrasesData from "@/data/world/common_phrases.json";

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

  // Get visa requirements for this country using the visa service
  const visaRequirements = visaService.getVisaRequirement(country.code);

  // Get primary language for common phrases using the country data
  // The DB stores languages as { "heb": "Hebrew" }, so we take the first key ("heb")
  const primaryLanguageCode = Object.keys(country.languages || {})[0];

  console.log("primaryLanguageCode", primaryLanguageCode);

  // Geography & Logistics Logic
  // Cast to any for Alpha speed - type definition mismatch fix scheduled for Beta
  const userWithCity = loggedUser as any;
  const inThisCountry = userWithCity?.currentCity?.country?.id === country?.id;
  const userCoords = (userWithCity?.currentCity?.coords as any)?.coordinates;
  const countryCoords = (country.coords as any)?.coordinates;

  const distanceMeta =
    userCoords && countryCoords
      ? getDistanceMetadata(
          { lat: userCoords[1], lng: userCoords[0] },
          { lat: countryCoords[1], lng: countryCoords[0] },
        )
      : null;

  const distanceLabel = distanceMeta?.flightStr
    ? `~ ${distanceMeta.flightStr}`
    : distanceMeta?.distanceStr || "N/A";

  const stats: StatItem[] = [
    {
      value: distanceLabel,
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
    <div className="bg-main min-h-screen selection:bg-brand selection:text-white">
      <main className="pb-xxl px-4 md:px-6 max-w-4xl mx-auto min-h-screen flex flex-col gap-12">
        <div className="flex flex-col gap-8 mt-8 md:mt-12">
          {/* Page Info */}
          <PageInfo
            title={country.name}
            subtitle={country.subRegion || country.region || ""}
          />

          {/* User Location Indicator */}
          {inThisCountry && (
            <div className="flex items-center gap-sm bg-brand/10 text-brand px-md py-xs rounded-full w-fit border border-brand/20 animate-fade-in shadow-sm">
              <Globe2 size={14} />
              <span className="text-upheader font-bold uppercase tracking-wider">
                You are in {country.name}
              </span>
            </div>
          )}

          {/* Hero Image */}
          <HeroImage
            src={
              country.imageHeroUrl ||
              (country.flags as any)?.svg ||
              (country.flags as any)?.png
            }
            name={country.name}
          />

          {/* Social Links */}
          <SocialLinks query={country.name} />
        </div>

        {/* Stats */}
        <Stats stats={stats} />

        {/* Cities Section - Now Floating */}
        {hasStates ? (
          <StateSection country={country} />
        ) : (
          <div className="flex flex-col gap-8">
            <FloatingCardList
              title="Popular Cities"
              description={`Discover the most visited destinations in ${country.name}`}
              items={
                country.cities?.map((city: any) => ({
                  id: city.cityId,
                  title: city.name,
                  subtitle: city.isCapital ? "Capital" : undefined,
                  image: city.media?.[0]?.url || city.imageHeroUrl,
                  href: `/cities/${city.cityId}`,
                  badge: city.isCapital ? "Capital" : undefined,
                })) || []
              }
              showViewAll={(country.cities?.length || 0) > 5}
              viewAllHref="/countries"
            />
          </div>
        )}

        <div className="flex flex-col gap-lg">
          <div className="grid grid-cols-2 gap-md">
            {giniValue && (
              <Block>
                <h3 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-xs">
                  Social Equality
                </h3>
                <p className="text-p font-bold text-txt-main">
                  {getGiniInsight(giniValue as number)}
                </p>
              </Block>
            )}

            {country.capitalName && (
              <Block>
                <h3 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-xs">
                  Capital
                </h3>
                <p className="text-p font-bold text-txt-main">
                  {country.capitalName}
                </p>
              </Block>
            )}
          </div>

          <FinanceSection />

          {country.languages && (
            <LanguageSection
              {...(country.languages as any)}
              primaryLanguageCode={primaryLanguageCode}
              commonPhrases={
                primaryLanguageCode &&
                (commonPhrasesData.commonPhrases as any)[primaryLanguageCode]
                  ? (commonPhrasesData.commonPhrases as any)[
                      primaryLanguageCode
                    ]
                  : []
              }
            />
          )}

          <LogisticsSection />

          {/* Visa Requirements */}
          {visaRequirements && <VisaRequirement visa={visaRequirements} />}

          <CultureSection />
          <HealthSection />
        </div>
      </main>
    </div>
  );
}
