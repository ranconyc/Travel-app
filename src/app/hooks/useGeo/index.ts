"use client";
import { useEffect, useState } from "react";

type Coords = { lat: number; lng: number };

export function useGeo() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => setError(err.message),
      {
        enableHighAccuracy: true,
        maximumAge: 60_000, // 1 min cache
        timeout: 10_000,
      }
    );
  }, []);

  return { coords, error };
}
