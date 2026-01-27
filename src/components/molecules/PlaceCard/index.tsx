"use client";

import { memo } from "react";
import { MapPin, Star } from "lucide-react";
import { Place } from "@/domain/place/place.schema";
import { calculateMatchScore, MatchScoreResult } from "@/services/discovery/matching.service";
import { getInterestLabel } from "@/domain/interests/interests.service";
import MatchScoreBadge from "@/components/molecules/MatchScoreBadge";
import Typography from "@/components/atoms/Typography/enhanced";
import BaseCard from "@/components/molecules/BaseCard";
import { PlaceImagesService } from "@/services/place-images.service";

interface PlaceCardProps {
  place: Place;
  userPersona?: {
    interests: string[];
    budget?: string;
    travelStyle?: string[];
  };
  distance?: number; // in km
  priority?: boolean;
  className?: string;
}

const PlaceCard = memo(function PlaceCard({
  place,
  userPersona,
  distance,
  priority = false,
  className = "",
}: PlaceCardProps) {
  // Calculate match score if user persona is provided
  const matchResult: MatchScoreResult | undefined = userPersona
    ? calculateMatchScore(userPersona, place)
    : undefined;

  // Get primary reason for match (first matching interest or budget fit)
  const getPrimaryReason = (): string => {
    if (!matchResult || !userPersona) return "";
    
    const { breakdown, reasoning } = matchResult;
    
    // Check for interest matches first
    if (breakdown.interests > 50) {
      const matchingInterests = userPersona.interests.filter(interest => 
        place.tags.includes(interest)
      );
      if (matchingInterests.length > 0) {
        const labels = matchingInterests
          .map(id => getInterestLabel(id))
          .slice(0, 2);
        
        return `Matches your love for ${labels.join(" & ")}`;
      }
    }
    
    // Check for budget fit
    if (breakdown.budget > 70) {
      return `Perfect for your ${userPersona.budget} budget`;
    }
    
    // Return first reasoning if available
    return reasoning[0] || "";
  };

  const primaryReason = getPrimaryReason();
  
  // Get image using the new service
  const imageUrl = place.imageHeroUrl || PlaceImagesService.getFallbackImage(place);

  return (
    <BaseCard
      image={{ 
        src: imageUrl, 
        alt: place.name || "Place image",
        priority 
      }}
      linkHref={`/place/${place.slug}`}
      className={className}
      priority={priority}
      gradient="bg-gradient-to-t from-black/40 via-black/20 to-transparent"
    >
      {/* MatchScore Badge - Top Right */}
      {matchResult && (
        <div className="absolute top-3 right-3 z-10">
          <MatchScoreBadge
            score={matchResult.score}
            size="sm"
            showLabel={false}
            matchResult={matchResult}
          />
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
});

PlaceCard.displayName = "PlaceCard";

export default PlaceCard;
