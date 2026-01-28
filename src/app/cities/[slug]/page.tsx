import React from "react";
import { getSession } from "@/lib/auth/get-current-user";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getCitiesWithCountry } from "@/lib/db/cityLocation.repo";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import {
  Heart,
  Shield,
  Instagram,
  MapPin,
  Clock,
  Calendar,
  FacebookIcon,
} from "lucide-react";
import { formatPopulation } from "@/domain/shared/utils/formatNumber";
import { AiFillTikTok } from "react-icons/ai";
import social from "@/data/social.json";
import { AiFillRedditCircle } from "react-icons/ai";
import HeroImage from "@/components/molecules/HeroImage";
import { prisma } from "@/lib/db/prisma";
import { filterAndSortPlaces } from "@/services/discovery/enhanced-matching.service";
import PlaceCard from "@/components/molecules/PlaceCard";
import Typography from "@/components/atoms/Typography";
import Block from "@/components/atoms/Block";
import Stats from "@/components/molecules/Stats";
import { StatItem } from "@/domain/common.schema";
import { Globe2, Users } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getDistanceMetadata } from "@/domain/shared/utils/geo";
import SocialLinks from "@/app/countries/[slug]/components/SocialLinks";
import PageInfo from "@/components/molecules/PageInfo";
import LogisticsSection from "@/app/countries/[slug]/components/LogisticsSection";
import CultureSection from "@/app/countries/[slug]/components/CultureSection";
import HealthSection from "@/app/countries/[slug]/components/HealthSection";
import LanguageSection from "@/components/organisms/LanguageSection";
import FloatingCardList from "@/components/molecules/FloatingCardList";

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
  const city = (await getCitiesWithCountry(slug)) as any;

  if (!city) {
    return <div>City not found</div>;
  }

  // Fetch places in this city with matching service
  let topPlaces: any[] = [];
  if (session?.user) {
    try {
      // Get all places in this city
      const allPlaces = await prisma.place.findMany({
        where: {
          cityRefId: city.id,
          isPermanentlyClosed: false,
        },
        take: 20, // Limit to top 20 for performance
      });

      // Filter and sort based on user preferences
      const userPersona = {
        interests: (session.user as any).persona?.interests || [],
        budget: (session.user as any).persona?.budget || "moderate",
        travelStyle: (session.user as any).persona?.travelStyle || [],
      };

      const userLocation = city.coords as any;
      const topPlaces = filterAndSortPlaces(
        allPlaces as any,
        userPersona,
        { limit: 8 }, // Show top 8
      );
    } catch (error) {
      console.error("Error fetching top places:", error);
    }
  }

  // Geography & Logistics Logic
  const userWithCity = session.user as any;
  const inThisCity = userWithCity?.currentCityId === city.id;
  const userCoords = (userWithCity?.currentLocation as any)?.coordinates;
  const cityCoords = (city.coords as any)?.coordinates;

  const distanceMeta =
    userCoords && cityCoords
      ? getDistanceMetadata(
          { lat: userCoords[1], lng: userCoords[0] },
          { lat: cityCoords[1], lng: cityCoords[0] },
        )
      : null;

  const distanceLabel = distanceMeta?.distanceStr || "N/A";

  const stats: StatItem[] = [
    {
      value: distanceLabel,
      label: "Away",
      icon: Globe2,
    },
    {
      value: formatPopulation(city.population || 0),
      label: "Population",
      icon: Users,
    },
    {
      value: city.idealDuration || "3-4 days",
      label: "Duration",
      icon: Clock,
    },
    {
      value: city.bestSeason || "Year-round",
      label: "Season",
      icon: Calendar,
    },
  ];

  // Helper to safely get country name
  const countryName = city.country?.name || "Unknown Country";

  return (
    <div className="bg-main min-h-screen selection:bg-brand selection:text-white">
      <main className="pb-xxl px-4 md:px-6 max-w-4xl mx-auto min-h-screen flex flex-col gap-12">
        <div className="flex flex-col gap-8 mt-8 md:mt-12">
          {/* Page Info */}
          <PageInfo title={city.name} subtitle={countryName} />

          {/* User Location Indicator */}
          {inThisCity && (
            <div className="flex items-center gap-sm bg-brand/10 text-brand px-md py-xs rounded-full w-fit border border-brand/20 animate-fade-in shadow-sm">
              <MapPin size={14} />
              <span className="text-upheader font-bold uppercase tracking-wider">
                You are in {city.name}
              </span>
            </div>
          )}

          {/* Hero Image */}
          <HeroImage
            src={
              city?.imageHeroUrl ||
              (city.country?.flags as any)?.svg ||
              (city.country?.flags as any)?.png
            }
            name={city.name}
          />

          {/* Social Links */}
          <SocialLinks query={`${city.name}, ${countryName}`} />
        </div>

        {/* Stats */}
        <Stats stats={stats} />

        {/* Top Picks for You - Now Floating */}
        {session?.user && topPlaces.length > 0 ? (
          <div className="flex flex-col gap-8">
            <FloatingCardList
              title="Top Picks for You"
              description={`Personalized recommendations in ${city.name}`}
              items={topPlaces.map((place) => {
                const userPersona = {
                  interests: (session.user as any).persona?.interests || [],
                  budget: (session.user as any).persona?.budget || "moderate",
                  travelStyle: (session.user as any).persona?.travelStyle || [],
                };

                // Calculate distance from city center
                const distance = city.coords
                  ? Math.sqrt(
                      Math.pow(
                        (place.place.coords as any).coordinates[0] -
                          (city.coords as any).coordinates[0],
                        2,
                      ) +
                        Math.pow(
                          (place.place.coords as any).coordinates[1] -
                            (city.coords as any).coordinates[1],
                          2,
                        ),
                    ) * 111 // Rough km conversion
                  : undefined;

                return {
                  id: place.place.id,
                  title: place.place.name,
                  subtitle: distance
                    ? `${distance.toFixed(1)} km away`
                    : undefined,
                  image: place.place.imageHeroUrl,
                  href: `/place/${place.place.slug}`,
                  badge:
                    place.matchResult.finalScore >= 80
                      ? `${Math.round(place.matchResult.finalScore)}% Match`
                      : undefined,
                };
              })}
              showViewAll={false}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <FloatingCardList
              title="Popular Places"
              description={`Discover the best spots in ${city.name}`}
              items={
                city.places?.slice(0, 8).map((place: any) => ({
                  id: place.id,
                  title: place.name,
                  subtitle: place.address,
                  image: place.imageHeroUrl,
                  href: `/place/${place.slug}`,
                  icon: <MapPin size={20} />,
                })) || []
              }
              showViewAll={false}
            />
          </div>
        )}

        <div className="flex flex-col gap-lg">
          <div className="grid grid-cols-2 gap-md">
            {city.isCapital && (
              <Block>
                <h3 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-xs">
                  Capital City
                </h3>
                <p className="text-p font-bold text-txt-main">{city.name}</p>
              </Block>
            )}

            {city.safety && (
              <Block>
                <h3 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-xs">
                  Safety
                </h3>
                <p className="text-p font-bold text-txt-main">{city.safety}</p>
              </Block>
            )}
          </div>

          {city.budget && (
            <Block>
              <h3 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-xs">
                Daily Budget
              </h3>
              <p className="text-p font-bold text-txt-main">
                {city.budget.currency || "$"} {city.budget.perDayMin}-
                {city.budget.perDayMax}
              </p>
            </Block>
          )}

          {city.timeZone && (
            <Block>
              <h3 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-xs">
                Timezone
              </h3>
              <p className="text-p font-bold text-txt-main">{city.timeZone}</p>
            </Block>
          )}

          <LogisticsSection />
          <CultureSection />
          <HealthSection />
        </div>
      </main>
    </div>
  );
}
