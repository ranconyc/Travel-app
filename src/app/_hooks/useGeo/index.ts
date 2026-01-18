"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { hasGeolocation } from "@/app/_utils/env";
import { getDistance } from "@/app/_utils/geo";
import { updateUserLocationAction } from "@/domain/user/user.actions";
import { useRouter } from "next/navigation";
import { useLocationStore } from "@/store/locationStore";

import { User } from "@/domain/user/user.schema";

type UseGeoOptions = {
  persistToDb?: boolean;
  distanceThresholdKm?: number;
  debounceMs?: number; // Minimum time between DB updates
  initialUser?: User | null;
  refreshOnUpdate?: boolean;
};

export function useGeo(options: UseGeoOptions = {}) {
  const {
    persistToDb = false,
    distanceThresholdKm = 1,
    debounceMs = 30000, // Global debounce
    initialUser,
    refreshOnUpdate = false,
  } = options;

  const router = useRouter();

  const { data: session } = useSession();

  // Store state
  const {
    coords,
    lastSavedCoords,
    loading,
    error,
    setCoords,
    setLastSavedCoords,
    setLoading,
    setError,
  } = useLocationStore();

  // Refs for logic control without triggering re-renders
  const lastSaveTimeRef = useRef<number>(0);
  const isSavingRef = useRef(false);
  const lastSavedCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  // Sync ref with store on mount/hydration
  useEffect(() => {
    if (lastSavedCoords && !lastSavedCoordsRef.current) {
      lastSavedCoordsRef.current = lastSavedCoords;
    }
  }, [lastSavedCoords]);

  // EFFECT 0: Hydrate from partial server data (User) if store is empty
  useEffect(() => {
    // If we have no coords yet, but we have an initialUser with a location
    if (!coords && initialUser?.currentLocation) {
      try {
        const loc = initialUser?.currentLocation as {
          type?: string;
          coordinates?: [number, number];
          lat?: number;
          lng?: number;
        } | null;

        if (loc && typeof loc === "object") {
          // Handle GeoJSON format: { type: "Point", coordinates: [lng, lat] }
          if (loc.type === "Point" && Array.isArray(loc.coordinates)) {
            const [lng, lat] = loc.coordinates;
            if (typeof lat === "number" && typeof lng === "number") {
              const initialCoords = { lat, lng };
              setCoords(initialCoords);
              setLastSavedCoords(initialCoords);
              lastSavedCoordsRef.current = initialCoords;
              setLoading(false);
            }
          }
          // Handle fallback/legacy format: { lat, lng }
          else if (typeof loc.lat === "number" && typeof loc.lng === "number") {
            const initialCoords = { lat: loc.lat, lng: loc.lng };
            setCoords(initialCoords);
            setLastSavedCoords(initialCoords);
            lastSavedCoordsRef.current = initialCoords;
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Failed to parse initial user location", err);
      }
    }
  }, [initialUser, coords, setCoords, setLastSavedCoords, setLoading]);

  // EFFECT 1: Watch Position (Real-time tracking)
  useEffect(() => {
    if (!hasGeolocation()) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    const onSuccess = (pos: GeolocationPosition) => {
      const newCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      setCoords(newCoords);
      setLoading(false);
    };

    const onError = (err: GeolocationPositionError) => {
      setError(err.message);
      setLoading(false);
    };

    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [setCoords, setError, setLoading]);

  // EFFECT 2: Persist to DB (Debounced & Threshold check)
  useEffect(() => {
    // 1. Basic checks
    if (!persistToDb || !coords || !session?.user?.id) return;

    const attemptSave = async () => {
      const now = Date.now();

      // 2. Debounce check (Time-based)
      if (now - lastSaveTimeRef.current < debounceMs) {
        return;
      }

      // 3. Distance check
      let shouldSave = false;
      const lastSaved = lastSavedCoordsRef.current;

      if (!lastSaved) {
        shouldSave = true; // First save
      } else {
        const distKm = getDistance(
          lastSaved.lat,
          lastSaved.lng,
          coords.lat,
          coords.lng,
          "KM",
        );

        // Movement threshold (with safety for GPS drift)
        // Note: Browsers usually have ~5-10m drift, so threshold < 0.05 is risky.
        if (distKm >= Math.max(distanceThresholdKm, 0.01)) {
          shouldSave = true;
        }
      }

      // 4. Execution
      if (shouldSave && !isSavingRef.current) {
        isSavingRef.current = true;
        try {
          console.log(`Saving location (moved > ${distanceThresholdKm}km)...`);

          await updateUserLocationAction(coords);

          lastSavedCoordsRef.current = coords;
          lastSaveTimeRef.current = now;
          setLastSavedCoords(coords);

          if (refreshOnUpdate) {
            router.refresh();
          }
        } catch (err) {
          console.error("Failed to update user location:", err);
        } finally {
          isSavingRef.current = false;
        }
      }
    };

    attemptSave();
  }, [
    coords,
    persistToDb,
    session?.user?.id,
    distanceThresholdKm,
    debounceMs,
    setLastSavedCoords,
    refreshOnUpdate,
    router,
  ]);

  return { coords, error, loading };
}
