"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPlacesAction } from "@/domain/place/place.actions";
import { Place } from "@/domain/place/place.schema";
import PlaceCard from "@/components/molecules/PlaceCard";
import { useUser } from "@/app/providers/UserProvider";
import { UserPersonaEnhanced } from "@/services/discovery/enhanced-matching.service";
import Typography from "@/components/atoms/Typography";
import { calculateDistance } from "@/services/discovery/enhanced-matching.service";
import SectionList from "@/components/molecules/SectionList";

// Mock user persona for demo - in real app this would come from user context
const DEMO_USER_PERSONA: UserPersonaEnhanced = {
  interests: ["rooftop_bars", "street_food_markets", "coworking_spaces"],
  budget: "moderate",
  travelStyle: ["solo", "remote"]
};

export default function PlaceList() {
  const user = useUser();
  
  const { data: places, isLoading } = useQuery({
    queryKey: ["places"],
    queryFn: async () => {
      const result = await getAllPlacesAction({});
      return result.success ? result.data : [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get user location for distance calculation (mock Bangkok coords for demo)
  const userLocation = {
    type: "Point" as const,
    coordinates: [100.5018, 13.7563] as [number, number]
  };

  // Filter and sort places (show top rated places)
  const filteredPlaces = places
    ?.filter(place => place.rating && place.rating > 0)
    ?.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    ?.slice(0, 12) || [];

  const getPlaceImage = (place: Place) => {
    return place.imageHeroUrl || "/images/placeholder-place.jpg";
  };

  const calculatePlaceDistance = (place: any): number | undefined => {
    if (!place.coords) return undefined;
    
    try {
      return calculateDistance(userLocation, place.coords);
    } catch (error) {
      console.error("Error calculating distance:", error);
      return undefined;
    }
  };

  if (!filteredPlaces.length && !isLoading) {
    return null; // Don't show section if no places
  }

  return (
    <SectionList
      title="Popular Places"
      href="/discovery"
      data={filteredPlaces}
      isLoading={isLoading}
      emptyText="No places found."
      renderItem={(place) => {
        const distance = calculatePlaceDistance(place);
        
        return (
          <div key={place.id} className="min-w-[320px] max-w-[380px]">
            <PlaceCard
              place={place as any} // Type cast to handle schema differences
              userPersona={user ? {
                interests: (user as any).persona?.interests || DEMO_USER_PERSONA.interests,
                budget: (user as any).persona?.budget || DEMO_USER_PERSONA.budget,
                travelStyle: (user as any).persona?.travelStyle || DEMO_USER_PERSONA.travelStyle
              } : DEMO_USER_PERSONA}
              distance={distance}
              priority={!!place.rating && place.rating >= 4.5}
              className="aspect-[4/3]"
            />
          </div>
        );
      }}
    />
  );
}
