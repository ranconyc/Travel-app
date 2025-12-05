"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { hasGeolocation } from "@/app/_utils/env";
import { getDistance } from "@/app/_utils/geo";
import { updateUserLocationWithCityAction } from "@/app/actions/locationActions";
import { useLocationStore } from "@/store/locationStore";

type UseGeoOptions = {
  persistToDb?: boolean;
  distanceThresholdKm?: number;
};

export function useGeo(options: UseGeoOptions = {}) {
  // Options
  const { persistToDb = false, distanceThresholdKm = 1 } = options;

  // Get session to know the logged user id
  const { data: session } = useSession();

  // Get location state and actions from store
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

  // Debugging useGeo (ONLY FOR DEVELOPMENT)
  useEffect(() => {
    console.log("useGeo debug", {
      session,
      coords,
      lastSavedCoords,
    });
  }, [session, coords, lastSavedCoords]);

  // EFFECT 1: Get current location from browser
  useEffect(() => {
    if (!hasGeolocation()) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    // On success get the coords and update store
    const onSuccess = (pos: GeolocationPosition) => {
      const next = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      setCoords(next);
      setLoading(false);
    };

    // On error set error and loading to false
    const onError = (err: GeolocationPositionError) => {
      setError(err.message);
      setLoading(false);
    };

    // Get the current position from the browser
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: 60_000, // 1 min cache
      timeout: 10_000,
    });
  }, [setCoords, setError, setLoading]);

  // EFFECT 2: Optionally persist to DB if user moved enough
  useEffect(() => {
    if (!persistToDb) return;
    if (!coords) return;
    if (!session?.user?.id) return;

    let shouldSave = false;

    if (!lastSavedCoords) {
      console.log("first time ever – save");
      shouldSave = true;
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

    if (!shouldSave) return;

    // Fire async logic inside effect
    (async () => {
      try {
        // 1) Call server action
        const result = await updateUserLocationWithCityAction(
          session.user.id,
          coords
        );

        // 2) Only after success -> update lastSavedCoords
        setLastSavedCoords(coords);

        // Optional: debug log
        console.log("Location synced with city:", result);
      } catch (err) {
        console.error("Failed to update user location with city", err);
      }
    })();
  }, [
    coords,
    lastSavedCoords,
    persistToDb,
    distanceThresholdKm,
    session?.user?.id,
    setLastSavedCoords,
  ]);

  return { coords, error, loading };
}
