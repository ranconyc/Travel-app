import Image from "next/image";

import Button from "@/components/atoms/Button";
import { Place } from "@/domain/place/place.schema";
import MatchScoreBadge from "@/components/molecules/MatchScoreBadge";
import { calculateMatchScore } from "@/services/discovery/matching.service";
import Block from "@/components/atoms/Block";
import Stats from "@/components/molecules/Stats";
import { StatItem } from "@/domain/common.schema";
import { Globe2, Users, Clock, Calendar, Star, MapPin } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getDistanceMetadata } from "@/domain/shared/utils/geo";
import SocialLinks from "@/app/(public)/countries/[slug]/components/SocialLinks";
import PageInfo from "@/components/molecules/PageInfo";
import LogisticsSection from "@/app/(public)/countries/[slug]/components/LogisticsSection";
import CultureSection from "@/app/(public)/countries/[slug]/components/CultureSection";
import HealthSection from "@/app/(public)/countries/[slug]/components/HealthSection";
import { getSession } from "@/lib/auth/get-current-user";
import { getPlaceBySlug } from "@/lib/db/place.repo";
import Link from "next/link";
import { CalendarPlus } from "lucide-react";

import PageHeader from "@/components/molecules/PageHeader";
import Typography from "@/components/atoms/Typography";
import HeroImage from "@/components/molecules/HeroImage";

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log("slug", slug);

  const activity = (await getPlaceBySlug(slug)) as any;
  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Place Not Found
          </h1>
          <p className="text-gray-600">
            The place with slug "{slug}" could not be found.
          </p>
          <a
            href="/"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  console.log("activity", activity);

  // Get session for user-specific features
  const session = await getSession();

  // Calculate match score for the current user
  let matchScore: number | undefined;
  let distance: number | undefined;
  const user = session?.user as any;

  if (user) {
    const matchResult = calculateMatchScore(
      {
        interests: user.persona?.interests || [],
        budget: user.persona?.budget || "moderate",
        travelStyle: user.persona?.travelStyle || [],
      },
      activity,
    );
    matchScore = matchResult.score;

    // Calculate distance from user's current city
    if (user.currentLocation && activity.coords) {
      const distanceMeta = getDistanceMetadata(
        user.currentLocation,
        activity.coords,
      );
      if (distanceMeta?.distanceStr) {
        distance = parseFloat(distanceMeta.distanceStr.replace(/[^0-9.]/g, ""));
      }
    }
  }

  const stats: StatItem[] = [
    {
      value: activity.rating ? `${activity.rating.toFixed(1)} ⭐` : "No rating",
      label: "Rating",
      icon: Star,
    },
    {
      value: distance ? `${distance.toFixed(1)} km` : "N/A",
      label: "Distance",
      icon: MapPin,
    },
    {
      value: activity.priceLevel ? "$".repeat(activity.priceLevel) : "N/A",
      label: "Price Level",
      icon: Globe2,
    },
    {
      value: activity.reviewCount || 0,
      label: "Reviews",
      icon: Users,
    },
  ];

  return (
    <div className="bg-main min-h-screen selection:bg-brand selection:text-white">
      <main className="pb-xxl px-4 md:px-6 max-w-4xl mx-auto min-h-screen flex flex-col gap-12">
        <div className="flex flex-col gap-8 mt-8 md:mt-12">
          {/* Page Info */}
          <PageInfo
            title={activity.name}
            subtitle={`${activity.city.name}, ${activity.city.country.name}`}
          />

          {/* Match Score Badge */}
          {matchScore && (
            <div className="flex items-center gap-sm bg-brand/10 text-brand px-md py-xs rounded-full w-fit border border-brand/20 animate-fade-in shadow-sm">
              <Star size={14} />
              <span className="text-upheader font-bold uppercase tracking-wider">
                {matchScore}% Match
              </span>
            </div>
          )}

          {/* Hero Image */}
          <HeroImage src={activity.imageHeroUrl} name={activity.name} />

          {/* Social Links */}
          <SocialLinks query={`${activity.name}, ${activity.city.name}`} />
        </div>

        {/* Stats */}
        <Stats stats={stats} />

        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activity.tags && activity.tags.length > 0 && (
              <Block>
                <h3 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activity.tags
                    .slice(0, 3)
                    .map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-surface-secondary rounded-full text-sm text-secondary hover:bg-surface-hover transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </Block>
            )}

            {activity.priceLevel && (
              <Block>
                <h3 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-4">
                  Price Level
                </h3>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 4 }, (_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < (activity.priceLevel || 0)
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    >
                      $
                    </span>
                  ))}
                </div>
              </Block>
            )}
          </div>

          {activity.bestTimeToVisit && (
            <Block>
              <h3 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-4">
                Best Time to Visit
              </h3>
              <p className="text-p font-bold text-txt-main">
                {activity.bestTimeToVisit}
              </p>
            </Block>
          )}

          {activity.summary && (
            <Block>
              <h3 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-4">
                About
              </h3>
              <p className="text-p text-txt-main leading-relaxed">
                {activity.summary}
              </p>
            </Block>
          )}

          {activity.address && (
            <Block>
              <h3 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-4">
                Address
              </h3>
              <p className="text-p font-bold text-txt-main">
                {activity.address}
              </p>
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
