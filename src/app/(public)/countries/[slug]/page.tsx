import { Metadata } from "next";
import { notFound } from "next/navigation";

import { FinanceSection } from "./components/FinanceSection";
import CultureSection from "./components/CultureSection";
import HealthSection from "./components/HealthSection";
import { getCountryWithCities } from "@/lib/db/country.repo";
import PageHeader from "@/components/organisms/PageHeader";
import Stats from "@/components/molecules/Stats";
import { StatItem } from "@/domain/common.schema";
import { Globe2, Users } from "lucide-react";
import { formatPopulation } from "@/domain/shared/utils/formatNumber";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import LogisticsSection from "./components/LogisticsSection";
import { Country } from "@/domain/country/country.schema";
import { getDistanceMetadata } from "@/domain/shared/utils/geo";
import { formatCountryTimezoneMetadata } from "@/domain/shared/utils/date";
import StateSection from "./components/StateSection";
import LanguageSection from "@/components/organisms/LanguageSection";
import Block from "@/components/atoms/Block";
import FloatingCardList from "@/components/molecules/FloatingCardList";
import VisaStatusChecker from "@/components/molecules/VisaStatusChecker";
import { visaService } from "@/domain/country/services/visa.service";

import commonPhrasesData from "@/data/world/common_phrases.json";

// Business Logic: Gini Insights move to a helper or could be in the Mapper/Service
export const getGiniInsight = (giniValue: number): string => {
  if (giniValue < 30) return "High Social Equality";
  if (giniValue < 45) return "Moderate Wealth Gap";
  return "Significant Economic Contrast";
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const country = await getCountryWithCities(slug);

  if (!country) {
    return {
      title: "Country Not Found",
    };
  }

  const cityNameStr =
    country.cities && country.cities.length > 0
      ? ` like ${country.cities
          .slice(0, 3)
          .map((c) => c.name)
          .join(", ")}`
      : "";

  return {
    title: `${country.name} Travel Guide | Top Cities & Places`,
    description: `Discover ${country.name}. Explore top destinations${cityNameStr}. Plan your trip with our travel guide.`,
    openGraph: {
      title: `${country.name} Travel Guide`,
      description: `Plan your trip to ${country.name}.`,
      images: [
        country.imageHeroUrl || (country.flags as any)?.png || "",
      ].filter(Boolean),
    },
  };
}

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
  const visaRequirements = visaService.getVisaRequirement(country.cca3);

  // Get primary language for common phrases using the country data
  // The DB stores languages as { "heb": "Hebrew" }, so we take the first key ("heb")
  const primaryLanguageCode = Object.keys(country.languages || {})[0];

  // Geography & Logistics Logic
  // Cast to any for Alpha speed - type definition mismatch fix scheduled for Beta
  const userWithCity = loggedUser as any;
  const inThisCountry = userWithCity?.currentCity?.country?.id === country?.id;
  const userCoords = (userWithCity?.currentCity?.coords as any)?.coordinates;
  const countryCoords = (country.coords as any)?.coordinates;

  // SSR: Get personalized visa status based on user's passport (homebase country)
  const userPassportCode =
    (userWithCity?.profile?.homeBaseCity?.country as any)?.cca3 || null;
  const userPassportCountryName =
    (userWithCity?.profile?.homeBaseCity?.country as any)?.name || null;
  const userVisaStatus = userPassportCode
    ? visaService.getUserVisaStatus(country.cca3, userPassportCode)
    : null;

  const distanceMeta =
    userCoords && countryCoords
      ? getDistanceMetadata(
          { lat: userCoords[1], lng: userCoords[0] },
          { lat: countryCoords[1], lng: countryCoords[0] },
        )
      : null;

  const travelValue = distanceMeta?.travelValue || "N/A";
  const travelLabel = distanceMeta?.travelLabel || "Away";

  const stats: StatItem[] = [
    {
      value: travelValue,
      label: travelLabel,
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
      <main className="pb-xxl px-4 md:px-6 max-w-4xl mx-auto min-h-screen flex flex-col gap-lg">
        <PageHeader
          title={country.name}
          subtitle={country.subRegion || country.region || ""}
          heroImageSrc={
            country.imageHeroUrl ||
            (country.flags as any)?.svg ||
            (country.flags as any)?.png
          }
          socialQuery={country.name}
          type="country"
          badge={
            inThisCountry && (
              <div className="flex items-center gap-sm bg-brand/10 text-brand px-md py-xs rounded-full w-fit border border-brand/20 animate-fade-in shadow-sm">
                <Globe2 size={14} />
                <span className="text-upheader font-bold uppercase tracking-wider">
                  You are in {country.name}
                </span>
              </div>
            )
          }
        />

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

        <div className="flex gap-lg">
          {(() => {
            const logistics = (country.logistics as any) || {};
            const tzData = formatCountryTimezoneMetadata(
              logistics.timezones,
              country.capitalCity?.timeZone,
            );

            if (!tzData.localTime && !tzData.rangeLabel) return null;

            return (
              <Block>
                <h3 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-xs">
                  Timezone
                </h3>
                <div className="flex flex-col">
                  <p className="text-p font-bold text-txt-main">
                    {tzData.localTime || tzData.rangeLabel}
                  </p>
                  <p className="text-micro text-secondary font-medium tracking-tight">
                    {tzData.spansTimezones
                      ? `Spans ${tzData.count} zones · ${tzData.rangeLabel}`
                      : tzData.timezoneName}
                    {tzData.relativeContext && ` · ${tzData.relativeContext}`}
                  </p>
                </div>
              </Block>
            );
          })()}
        </div>

        <div className="flex flex-col gap-lg">
          {/* Visa Status & Requirements - Shows personalized status when logged in */}
          {visaRequirements && (
            <VisaStatusChecker
              visa={visaRequirements}
              userStatus={userVisaStatus}
              passportCountry={userPassportCountryName}
              destinationCountryName={country.name}
            />
          )}

          {/* Other Info Cards */}
          <div className="flex gap-lg overflow-x-scroll">
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

            <CultureSection />
            <HealthSection />
          </div>
        </div>
      </main>
    </div>
  );
}
