import { useState, useEffect, useMemo } from "react";
import { City } from "@/domain/city/city.schema";
import { getDistanceMetadata } from "@/domain/shared/utils/geo";
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

export function useCityCard(
  city: City,
  userLocation?: { lat: number; lng: number } | null,
) {
  // Get location from store if not provided via props
  const { getFinalLocation } = useLocationStore();
  const coords = getFinalLocation();
  const effectiveLocation = userLocation ?? coords;

  const [distanceMeta, setDistanceMeta] = useState<{
    label: string | null;
  }>({ label: null });
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
    setDistanceMeta({ label: null });

    const hasCoords = !!effectiveLocation && !!city.coords?.coordinates?.length;

    if (!hasCoords || !cacheKey) {
      setIsLoadingDistance(false);
      return;
    }

    // Check cache first (using useStorageState)
    // Use client-side only check to avoid hydration mismatch
    if (
      typeof window !== "undefined" &&
      cachedEntry &&
      Date.now() - cachedEntry.timestamp < 3600000
    ) {
      setDistanceMeta({ label: cachedEntry.distanceLabel });
      setIsLoadingDistance(false);
      return;
    }

    // Calculate distance asynchronously
    const timer = setTimeout(() => {
      try {
        const meta = getDistanceMetadata(
          { lat: effectiveLocation!.lat, lng: effectiveLocation!.lng },
          {
            lat: city.coords!.coordinates[1],
            lng: city.coords!.coordinates[0],
          },
        );

        const label = meta?.fullLabel ?? null;

        // Cache the result using useStorageState
        if (typeof window !== "undefined") {
          setCachedEntry({
            distanceLabel: label,
            timestamp: Date.now(),
          });
        }

        setDistanceMeta({ label });
      } catch (error) {
        console.error("Error calculating distance:", error);
        setDistanceMeta({ label: null });
      } finally {
        setIsLoadingDistance(false);
      }
    }, 50); // Small delay to show loading state

    return () => clearTimeout(timer);
  }, [cacheKey, cachedEntry, setCachedEntry, city, effectiveLocation]);

  return {
    distanceLabel: distanceMeta.label,
    isLoadingDistance,
  };
}
