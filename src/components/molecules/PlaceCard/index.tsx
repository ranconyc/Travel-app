"use client";

import { memo } from "react";
import { MapPin, Star } from "lucide-react";
import { Place } from "@/domain/place/place.schema";
import {
  calculateMatchScore,
  MatchScoreResult,
} from "@/services/discovery/matching.service";
import { getInterestLabel } from "@/domain/interests/interests.service";
import MatchScoreBadge from "@/components/molecules/MatchScoreBadge";
import Typography from "@/components/atoms/Typography";
import Card from "@/components/molecules/Card";
import ImageWithFallback from "@/components/atoms/ImageWithFallback";
import { useState, useEffect } from "react";
import { getPlaceImage } from "@/utils/image-helpers";
import { cva } from "class-variance-authority";

// Internal variants for badge styles
const tagVariants = cva(
  "px-2.5 py-1 backdrop-blur-md rounded-full text-[10px] font-medium uppercase tracking-wide border transition-colors",
  {
    variants: {
      intent: {
        default: "bg-white/10 text-white/90 border-white/5 hover:bg-white/20",
        primary: "bg-primary-500/20 text-primary-100 border-primary-500/30",
        more: "bg-transparent text-white/60 border-transparent px-2",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  },
);

interface PlaceCardProps {
  place: Place;
  userPersona?: {
    interests: string[];
    budget?: string;
    travelStyle?: string[];
  };
  distance?: number;
  useUnsplash?: boolean; // Enable Unsplash API integration
}

function PlaceCard({
  place,
  userPersona,
  distance,
  useUnsplash = true,
}: PlaceCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate match score if user persona is provided
  const matchResult: MatchScoreResult | null = userPersona
    ? calculateMatchScore(
        {
          interests: userPersona.interests,
          budget: userPersona.budget,
          travelStyle: userPersona.travelStyle,
        },
        place,
      )
    : null;

  // Get primary reason for match
  const primaryReason =
    matchResult?.score && matchResult.score > 0
      ? getInterestLabel(place.tags[0]) // Use first tag as primary reason
      : null;

  // Fetch image from Unsplash if no image exists and Unsplash is enabled
  useEffect(() => {
    const fetchImage = async () => {
      if (!useUnsplash || imageUrl) return; // Don't fetch if disabled or image already exists

      setIsLoading(true);
      try {
        const unsplashImage = await getPlaceImage(place.name);
        if (unsplashImage) {
          setImageUrl(unsplashImage);
        }
      } catch (error) {
        console.warn(`Failed to fetch image for ${place.name}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [place.name, useUnsplash, imageUrl]);

  return (
    <Card className="group relative overflow-hidden cursor-pointer rounded-3xl h-full shadow-card hover:shadow-xl transition-all duration-300 border-0">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={imageUrl || ""}
          alt={place.name}
          fill
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          fallback={
            <div className="w-full h-full bg-surface-dark flex items-center justify-center">
              {isLoading ? (
                <div className="animate-pulse">
                  <MapPin className="text-secondary w-12 h-12 opacity-40" />
                </div>
              ) : (
                <MapPin className="text-white w-12 h-12 opacity-20" />
              )}
            </div>
          }
        />
        {/* Superior Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
      </div>

      {/* Floating Badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {place.rating && (
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <Typography variant="label-sm" weight="bold" color="white">
              {place.rating.toFixed(1)}
            </Typography>
          </div>
        )}
      </div>

      {matchResult && (
        <div className="absolute top-4 right-4 z-10">
          <MatchScoreBadge score={matchResult.score} />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-end p-5">
        {/* Main Content */}
        <div className="space-y-3 mb-1">
          {/* Title */}
          <Typography
            variant="h3"
            color="white"
            weight="bold"
            className="leading-tight drop-shadow-md group-hover:text-primary-100 transition-colors"
          >
            {place.name}
          </Typography>

          {/* Distance & Info */}
          <div className="flex items-center gap-4 text-white/90">
            {distance !== undefined && (
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-primary-400" />
                <Typography variant="label-sm" weight="medium" color="white">
                  {distance < 1
                    ? `${Math.round(distance * 1000)}m away`
                    : `${distance.toFixed(1)}km away`}
                </Typography>
              </div>
            )}

            {place.priceLevel && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-sm border border-white/10">
                <span className="text-xs font-bold text-white tracking-widest">
                  {"$".repeat(place.priceLevel)}
                  <span className="text-white/30">
                    {"$".repeat(4 - place.priceLevel)}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Primary Match Reason */}
          {primaryReason && (
            <div className={tagVariants({ intent: "primary" })}>
              <Typography
                variant="micro"
                className="text-primary-100 font-medium"
              >
                ✨ {primaryReason}
              </Typography>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/10">
            {place.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={tagVariants({ intent: "default" })}>
                {getInterestLabel(tag)}
              </span>
            ))}
            {place.tags.length > 3 && (
              <span className={tagVariants({ intent: "more" })}>
                +{place.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default memo(PlaceCard);
