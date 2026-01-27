"use client";

import { memo } from "react";
import { MapPin, Star } from "lucide-react";
import { Place } from "@/domain/place/place.schema";
import { calculateMatchScore, MatchScoreResult } from "@/services/discovery/matching.service";
import { getInterestLabel } from "@/domain/interests/interests.service";
import MatchScoreBadge from "@/components/molecules/MatchScoreBadge";
import Typography from "@/components/atoms/Typography/enhanced";
import BaseCard from "@/components/molecules/BaseCard";
import ImageWithFallback from "@/components/atoms/ImageWithFallback";
import { useState, useEffect } from "react";
import { getPlaceImage, getFallbackImage } from "@/utils/image-helpers";

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

function EnhancedPlaceCardComponent({ 
  place, 
  userPersona, 
  distance,
  useUnsplash = true 
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
        place
      )
    : null;

  // Get primary reason for match
  const primaryReason = matchResult?.score && matchResult.score > 0
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
    <BaseCard className="group relative overflow-hidden cursor-pointer">
      {/* Background Image */}
      <div className="aspect-[4/3] relative overflow-hidden">
        <ImageWithFallback
          src={imageUrl || ""}
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          fallback={
            <div className="w-full h-full bg-surface-secondary flex items-center justify-center">
              {isLoading ? (
                <div className="animate-pulse">
                  <MapPin className="text-secondary w-12 h-12 opacity-40" />
                </div>
              ) : (
                <MapPin className="text-secondary w-12 h-12 opacity-20" />
              )}
            </div>
          }
        />
        
        {/* Match Score Badge - Top Right */}
        {matchResult && (
          <div className="absolute top-3 right-3 z-10">
            <MatchScoreBadge score={matchResult.score} />
          </div>
        )}
      
        {/* Rating Badge - Top Left */}
        {place.rating && (
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1 bg-surface-secondary/80 px-2 py-1 rounded-full">
              <Star size={12} className="text-yellow-400 fill-current" />
              <Typography variant="micro" className="text-inverse">
                {place.rating.toFixed(1)}
              </Typography>
            </div>
          </div>
        )}
      
        {/* Content Overlay - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          {/* Place Name */}
          <Typography variant="display-sm" color="inverse" className="leading-tight mb-3">
            {place.name}
          </Typography>
        
          {/* Distance */}
          {distance !== undefined && (
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-white/90" />
              <Typography variant="label-sm" color="inverse" className="text-white/90">
                {distance < 1 
                  ? `${Math.round(distance * 1000)}m away` 
                  : `${distance.toFixed(1)}km away`
                }
              </Typography>
            </div>
          )}
        
          {/* Primary Reason */}
          {primaryReason && (
            <div className="bg-surface-secondary/60 rounded-lg px-4 py-3 mb-3">
              <Typography variant="label-sm" color="inverse" className="leading-tight">
                {primaryReason}
              </Typography>
            </div>
          )}
        </div>
      </div>
      
      {/* Additional Info Bar - Overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-surface/95 dark:bg-surface border-t border-stroke p-4">
        <div className="flex items-center justify-between">
          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {place.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-surface-secondary/60 text-inverse rounded-full text-label"
              >
                {getInterestLabel(tag)}
              </span>
            ))}
          </div>
          
          {/* Price Level */}
          {place.priceLevel && (
            <div className="flex items-center gap-1">
              <span className="text-inverse text-ui-sm">
                {"$".repeat(place.priceLevel)}
              </span>
            </div>
          )}
        </div>
      </div>
    </BaseCard>
  );
}

export default memo(EnhancedPlaceCardComponent);
