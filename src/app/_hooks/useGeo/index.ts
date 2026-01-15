"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { hasGeolocation } from "@/app/_utils/env";
import { getDistance } from "@/app/_utils/geo";
import { updateUserLocationWithCityAction } from "@/app/actions/locationActions";
import { useLocationStore } from "@/store/locationStore";

import { User } from "@/domain/user/user.schema";

type UseGeoOptions = {
  persistToDb?: boolean;
  distanceThresholdKm?: number;
  debounceMs?: number; // Minimum time between DB updates
  initialUser?: User | null;
};

export function useGeo(options: UseGeoOptions = {}) {
  const {
    persistToDb = false,
    distanceThresholdKm = 1,
    debounceMs = 30000, // Global debounce
    initialUser,
  } = options;

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

  // EFFECT 0: Hydrate from partial server data (User) if store is empty
  useEffect(() => {
    // If we have no coords yet, but we have an initialUser with a location
    if (!coords && initialUser?.currentLocation) {
      try {
        // Prisma Json type needs casting/checking
        const loc = initialUser.currentLocation as any;
        if (typeof loc.lat === "number" && typeof loc.lng === "number") {
          const initialCoords = { lat: loc.lat, lng: loc.lng };

          // console.log("Hydrating useGeo from server user data:", initialCoords);

          setCoords(initialCoords);
          setLastSavedCoords(initialCoords); // Assume it's saved since it came from DB
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to parse initial user location", err);
      }
    }
  }, [initialUser, coords, setCoords, setLastSavedCoords, setLoading]);

  useEffect(() => {
    // console.count("useGeo");
    // console.log("useGeo: coords", coords);
    // console.log("useGeo: lastSavedCoords", lastSavedCoords);
    // console.log("useGeo: loading", loading);
    // console.log("useGeo: error", error);
  }, [coords, lastSavedCoords, loading, error]);
  // Keep the latest coords in a ref to usage in intervals/timeouts if needed,
  // though here we rely on the effect dependency which is fine with proper debouncing.

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

      // Only update store if actual change (though basic float comparison is tricky,
      // Zustand might handle equality check, but let's just set it)
      setCoords(newCoords);
      setLoading(false);
    };

    const onError = (err: GeolocationPositionError) => {
      setError(err.message);
      setLoading(false);
    };

    // Use watchPosition for continuous updates instead of one-off getCurrentPosition
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
      // Prevent frequent saves even if distance threshold is met (e.g. driving in circles)
      if (now - lastSaveTimeRef.current < debounceMs) {
        return;
      }

      // 3. Distance check
      // Move this logic here to avoid dependency cycles with lastSavedCoords
      let shouldSave = false;

      if (!lastSavedCoords) {
        shouldSave = true; // First save
      } else {
        const distKm = getDistance(
          lastSavedCoords.lat,
          lastSavedCoords.lng,
          coords.lat,
          coords.lng,
          "KM"
        );

        if (distKm >= distanceThresholdKm) {
          shouldSave = true;
        }
      }

      // 4. Execution
      if (shouldSave && !isSavingRef.current) {
        isSavingRef.current = true;
        try {
          console.log(`Saving location (moved > ${distanceThresholdKm}km)...`);

          await updateUserLocationWithCityAction(session.user.id, coords);

          setLastSavedCoords(coords);
          lastSaveTimeRef.current = now;
        } catch (err) {
          console.error("Failed to update user location:", err);
        } finally {
          isSavingRef.current = false;
        }
      }
    };

    attemptSave();

    // We intentionally include `lastSavedCoords` here.
    // The debounce logic prevents infinite loops because we update `lastSaveTimeRef`
    // and check it before proceeding.
  }, [
    coords,
    lastSavedCoords,
    persistToDb,
    session?.user?.id,
    distanceThresholdKm,
    debounceMs,
    setLastSavedCoords,
  ]);

  return { coords, error, loading };
}
