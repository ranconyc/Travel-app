"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { hasGeolocation } from "@/app/_utils/env";
import useStorageState from "../useStorageState";
import { getDistance } from "@/app/_utils/geo";

type Coords = { lat: number; lng: number };

const LAST_LOCATION_KEY = "lastLocation";
const LAST_SAVED_LOCATION_KEY = "lastSavedLocation";

type UseGeoOptions = {
  persistToDb?: boolean;
  distanceThresholdKm?: number;
};

export function useGeo(options: UseGeoOptions = {}) {
  const { persistToDb = false, distanceThresholdKm = 1 } = options;

  const { data: session } = useSession();

  // Persist current coords in localStorage
  const [coords, setCoords] = useStorageState<Coords | null>(
    LAST_LOCATION_KEY,
    null
  );

  // Persist last coords that were synced to DB
  const [lastSavedCoords, setLastSavedCoords] = useStorageState<Coords | null>(
    LAST_SAVED_LOCATION_KEY,
    null
  );

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // debugging useGeo
  useEffect(() => {
    console.log("useGeo debug", {
      session,
      coords,
      lastSavedCoords,
    });
  }, [session, coords, lastSavedCoords]);

  // 1) Get current location from browser
  useEffect(() => {
    if (!hasGeolocation()) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next: Coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setCoords(next); // updates state + localStorage
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60_000, // 1 min cache
        timeout: 10_000,
      }
    );
  }, [setCoords]);

  // 2) Optionally persist to DB if user moved enough
  useEffect(() => {
    if (!persistToDb) return;
    if (!coords) return;
    if (!session?.user?.id) return;

    let shouldSave = false;

    if (!lastSavedCoords) {
      // first time ever – save
      shouldSave = true;
    } else {
      const distKm = getDistance(
        lastSavedCoords.lat,
        lastSavedCoords.lng,
        coords.lat,
        coords.lng,
        "KM" // explicit, even though it's default
      );

      if (distKm >= distanceThresholdKm) {
        shouldSave = true;
      }
    }

    if (!shouldSave) return;

    // Update our "last saved" reference locally
    setLastSavedCoords(coords);

    // Fire server action / API – "fire and forget"
    void updateUserLocationWithCity(session.user.id, coords);
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

// TODO: implement this server-side (server action / route)
async function updateUserLocationWithCity(userId: string, coords: Coords) {
  // 1) resolve city based on coords
  // 2) if not found -> create city
  // 3) prisma.user.update({ currentLocation, currentCityId })
}
