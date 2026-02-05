"use client";

import React from "react";
import { MapPin, Star, Users, Globe2 } from "lucide-react";
import Block from "@/components/atoms/Block";
import Stats from "@/components/molecules/Stats";
import { StatItem } from "@/domain/common.schema";
import { getDistanceMetadata } from "@/domain/shared/utils/geo";
import PageHeader from "@/components/organisms/PageHeader";
import { calculateMatchScore } from "@/domain/discovery/services/matching.service";
import PlaceActionRow from "./PlaceActionRow";
import PlaceAmenities from "./PlaceAmenities";
import PlaceHours from "./PlaceHours";
import PlaceGallery from "./PlaceGallery";
import Typography from "@/components/atoms/Typography";

interface PlaceDetailViewProps {
  activity: any; // Using any to match existing data shape
  user: any; // Using any for user/session
}

export default function PlaceDetailView({
  activity,
  user,
}: PlaceDetailViewProps) {
  // Calculate match score for the current user
  let matchScore: number | undefined;
  let distance: number | undefined;

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
      <main className="pb-xxl px-4 md:px-6 max-w-4xl mx-auto min-h-screen flex flex-col gap-8 md:gap-12">
        <PageHeader
          title={activity.name}
          subtitle={`${activity.city?.name || "Unknown City"}, ${
            activity.city?.country?.name || "Unknown Country"
          }`}
          heroImageSrc={activity.imageHeroUrl}
          socialQuery={`${activity.name}, ${activity.city?.name || ""}`}
          type="place"
          badge={
            matchScore && (
              <div className="flex items-center gap-sm bg-brand/10 text-brand px-md py-xs rounded-full w-fit border border-brand/20 animate-fade-in shadow-sm">
                <Star size={14} />
                <span className="text-upheader font-bold uppercase tracking-wider">
                  {matchScore}% Match
                </span>
              </div>
            )
          }
        />

        {/* Action Buttons */}
        <section className="-mt-6">
          <PlaceActionRow
            websiteUrl={activity.websiteUrl}
            phoneNumber={activity.phoneNumber}
            googlePlaceId={activity.googlePlaceId}
            coords={activity.coords}
          />
        </section>

        {/* Stats */}
        <Stats stats={stats} />

        <div className="flex flex-col gap-8">
          {/* About & Summary */}
          {activity.summary && (
            <Block>
              <Typography
                variant="h3"
                className="text-upheader font-bold text-secondary uppercase tracking-wider mb-4"
              >
                About
              </Typography>
              <p className="text-p text-txt-main leading-relaxed">
                {activity.summary}
              </p>
            </Block>
          )}

          {/* Gallery */}
          {activity.media && activity.media.length > 0 && (
            <PlaceGallery
              media={activity.media}
              heroImage={activity.imageHeroUrl}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Hours & Price */}
            <div className="space-y-6">
              <PlaceHours openingHours={activity.openingHours} />

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

            {/* Right Column: Amenities & Best Time */}
            <div className="space-y-6">
              <PlaceAmenities
                amenities={activity.amenities}
                accessibility={activity.accessibility}
              />

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
            </div>
          </div>

          {/* Tags */}
          {activity.tags && activity.tags.length > 0 && (
            <Block>
              <h3 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {activity.tags.map((tag: string, index: number) => (
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
        </div>
      </main>
    </div>
  );
}
