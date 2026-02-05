"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/providers/UserProvider";
import { useLocationStore } from "@/store/locationStore";
import { hasGeolocation } from "@/domain/shared/utils/env";
import { getDistance } from "@/domain/shared/utils/geo";
import { updateUserLocationAction } from "@/domain/user/user.actions";
import { User, GeoPoint } from "@/domain/user/user.schema";

export type UseGeoOptions = {
  persistToDb?: boolean;
  distanceThresholdKm?: number;
  debounceMs?: number;
  initialUser?: User | null;
  refreshOnUpdate?: boolean;
};

/**
 * Helper to normalize different GeoPoint shapes into {lat, lng}
 */
function parseGeoPoint(
  loc: GeoPoint | { lat: number; lng: number } | null | unknown,
): { lat: number; lng: number } | null {
  if (!loc || typeof loc !== "object") return null;

  try {
    // Handle Prisma/GeoJSON Point: { type: "Point", coordinates: [lng, lat] }
    if (
      "type" in loc &&
      loc.type === "Point" &&
      "coordinates" in loc &&
      Array.isArray(loc.coordinates)
    ) {
      const [lng, lat] = loc.coordinates;
      if (typeof lat === "number" && typeof lng === "number") {
        return { lat, lng };
      }
    }

    // Handle direct coords: { lat, lng }
    if (
      "lat" in loc &&
      "lng" in loc &&
      typeof loc.lat === "number" &&
      typeof loc.lng === "number"
    ) {
      return { lat: loc.lat, lng: loc.lng };
    }
  } catch (err) {
    console.error("[parseGeoPoint] Failed to parse location", err);
  }

  return null;
}

export function useGeo(options: UseGeoOptions = {}) {
  const {
    persistToDb = false,
    distanceThresholdKm = 1,
    debounceMs = 30000,
    initialUser,
    refreshOnUpdate = false,
  } = options;

  const router = useRouter();
  const user = useUser();
  const {
    getFinalLocation,
    setBrowserLocation,
    setDbLocation,
    lastSavedCoords,
    setLastSavedCoords,
    loading,
    setLoading,
    error,
    setError,
  } = useLocationStore();

  // Get computed final location
  const coords = getFinalLocation();

  const lastSaveTimeRef = useRef<number>(0);
  const isSavingRef = useRef(false);
  const initializedRef = useRef(false);

  // Refs for timeout protection to avoid dependency noise
  const coordsRef = useRef(coords);
  const loadingRef = useRef(loading);

  useEffect(() => {
    coordsRef.current = coords;
    loadingRef.current = loading;
  }, [coords, loading]);

  // 1. Initialization Effect: Runs once to sync initialUser state to store
  useEffect(() => {
    if (initializedRef.current || coords || !initialUser?.currentLocation)
      return;

    const initialCoords = parseGeoPoint(initialUser.currentLocation);
    if (initialCoords) {
      // Initialize from DB location (user's saved location)
      setDbLocation(initialCoords);
      setLastSavedCoords(initialCoords);
      setLoading(false);
      initializedRef.current = true;
    }
  }, [
    initialUser?.currentLocation,
    coords,
    setDbLocation,
    setLastSavedCoords,
    setLoading,
  ]);

  // 2. Tracking Effect: Manages browser geolocation watch with timeout protection
  useEffect(() => {
    const userId = user?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    if (!hasGeolocation()) {
      setError({ code: "UNSUPPORTED", message: "Geolocation not supported" });
      setLoading(false);
      return;
    }

    let watchId: number | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    // Timeout protection: Stop loading if browser doesn't respond in 15s
    timeoutId = setTimeout(() => {
      // Use refs to get current state without triggering effect re-run
      if (loadingRef.current && !coordsRef.current) {
        setLoading(false);
        setError({
          code: "TIMEOUT",
          message: "Location request timed out",
        });
      }
    }, 15000);

    try {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          if (timeoutId) clearTimeout(timeoutId);
          setBrowserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          if (timeoutId) clearTimeout(timeoutId);
          setError({ code: "PERMISSION_DENIED", message: err.message });
          setLoading(false);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error("[useGeo] Geolocation failed", err);
      setLoading(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [user?.id, setBrowserLocation, setError, setLoading]);

  // 3. Persistence Sync: Smart DB synchronization
  useEffect(() => {
    const userId = user?.id;

    if (!persistToDb || !coords || !userId || isSavingRef.current) {
      return;
    }

    const syncToDb = async () => {
      const now = Date.now();
      const timeSinceLastSave = now - lastSaveTimeRef.current;

      // Throttle Check
      if (timeSinceLastSave < debounceMs) {
        return;
      }

      // Distance Threshold Check
      if (lastSavedCoords) {
        const dist = getDistance(
          lastSavedCoords.lat,
          lastSavedCoords.lng,
          coords.lat,
          coords.lng,
          "KM",
        );
        if (dist < Math.max(distanceThresholdKm, 0.01)) {
          return;
        }
      }

      isSavingRef.current = true;
      try {
        await updateUserLocationAction(coords);
        lastSaveTimeRef.current = now;
        setLastSavedCoords(coords);

        if (refreshOnUpdate) {
          router.refresh();
        }
      } catch (err) {
        console.error("[useGeo] Persistence failed", err);
      } finally {
        isSavingRef.current = false;
      }
    };

    syncToDb();
  }, [
    coords,
    persistToDb,
    user?.id,
    lastSavedCoords,
    distanceThresholdKm,
    debounceMs,
    setLastSavedCoords,
    refreshOnUpdate,
    router,
  ]);

  // Atomic Design Ready state
  const isLocating = loading && !coords;

  return { coords, error, loading, isLocating };
}
