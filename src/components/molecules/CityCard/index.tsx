"use client";

import { useState, useEffect, useMemo } from "react";
import { City } from "@/domain/city/city.schema";
import {
  formatDistanceLabel,
  formatFlightTimeLabelFromDistance,
  getDistance,
} from "@/app/_utils/geo";
import BaseCard from "@/components/molecules/BaseCard";
import DistanceBadge from "@/components/atoms/DistanceBadge";
import useStorageState from "@/hooks/ui/useStorageState";
import { useLocationStore } from "@/store/locationStore";

// Cache entry type
type CacheEntry = {
  distanceLabel: string | null;
  timestamp: number;
};

// Generate a unique cache key for this city-location pair
const getCacheKey = (
  cityId: string,
  userLocation: { lat: number; lng: number } | null,
) => {
  if (!userLocation) return null;
  const locationKey = `${userLocation.lat.toFixed(
    2,
  )}_${userLocation.lng.toFixed(2)}`;
  return `distance_${cityId}_${locationKey}`;
};

type CityCardProps = {
  index: number;
  city: City;
  userLocation?: { lat: number; lng: number } | null;
  onDismiss?: (cityId: string) => void;
};

export default function CityCard({ city, userLocation, index }: CityCardProps) {
  // Get location from store if not provided via props
  const { coords } = useLocationStore();
  const effectiveLocation = userLocation ?? coords;

  const [distanceLabel, setDistanceLabel] = useState<string | null>(null);
  const [isLoadingDistance, setIsLoadingDistance] = useState(true);

  // Memoize the cache key to avoid recalculating
  const cacheKey = useMemo(
    () => getCacheKey(city.cityId, effectiveLocation ?? null),
    [city.cityId, effectiveLocation],
  );

  // Use the existing useStorageState hook for caching
  const [cachedEntry, setCachedEntry] = useStorageState<CacheEntry | null>(
    cacheKey || "",
    null,
  );

  useEffect(() => {
    // Reset loading state when inputs change
    setIsLoadingDistance(true);
    setDistanceLabel(null);

    const hasCoords = !!effectiveLocation && !!city.coords?.coordinates?.length;

    if (!hasCoords || !cacheKey) {
      setIsLoadingDistance(false);
      return;
    }

    // Check cache first (using useStorageState)
    if (cachedEntry && Date.now() - cachedEntry.timestamp < 3600000) {
      setDistanceLabel(cachedEntry.distanceLabel);
      setIsLoadingDistance(false);
      return;
    }

    // Calculate distance asynchronously
    const timer = setTimeout(() => {
      try {
        const distance = getDistance(
          effectiveLocation!.lat,
          effectiveLocation!.lng,
          city.coords!.coordinates[1],
          city.coords!.coordinates[0],
        );

        // Round distance to prevent hydration mismatch between server and client
        const roundedDistance =
          distance !== null ? Math.round(distance * 10) / 10 : null;

        const label =
          roundedDistance !== null
            ? roundedDistance >= 3000
              ? formatFlightTimeLabelFromDistance(roundedDistance)
              : formatDistanceLabel(roundedDistance)
            : null;

        // Cache the result using useStorageState
        setCachedEntry({
          distanceLabel: label,
          timestamp: Date.now(),
        });

        setDistanceLabel(label);
      } catch (error) {
        console.error("Error calculating distance:", error);
        setDistanceLabel(null);
      } finally {
        setIsLoadingDistance(false);
      }
    }, 50); // Small delay to show loading state

    return () => clearTimeout(timer);
  }, [cacheKey, cachedEntry, setCachedEntry, city, effectiveLocation]);

  return (
    <BaseCard
      linkHref={`/city/${city.cityId}`}
      image={{
        src: city?.imageHeroUrl ?? undefined,
        alt: city?.name ?? undefined,
      }}
      priority={index < 3}
    >
      <div className="h-full flex items-end">
        <div>
          {isLoadingDistance ? (
            <div className="bg-black/50 text-white px-2 py-1 rounded-full text-xs w-fit mb-2 animate-pulse">
              Loading...
            </div>
          ) : distanceLabel ? (
            <DistanceBadge distanceLabel={distanceLabel} />
          ) : null}
          <h3 className="text-white font-bold leading-tight text-[clamp(14px,2.8vw,18px)] line-clamp-2">
            {city.name}
          </h3>
        </div>
      </div>
    </BaseCard>
  );
}
