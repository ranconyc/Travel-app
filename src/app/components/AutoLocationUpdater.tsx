"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useLocation } from "@/app/providers/LocationProvider";
import { updateUserLocationAction } from "@/domain/user/location.actions";

const LOCATION_STORAGE_KEY = "last_location";
const MIN_DISTANCE_KM = 5; // Only update if moved more than 5km

// Calculate distance between two coordinates in km (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function AutoLocationUpdater() {
  const { data: session } = useSession();
  const { location } = useLocation();
  const hasUpdatedRef = useRef(false);

  useEffect(() => {
    // Only update if user is logged in and we have location
    if (session?.user && location && !hasUpdatedRef.current) {
      const updateLocation = async () => {
        try {
          // Get last location from localStorage
          const lastLocationStr = localStorage.getItem(LOCATION_STORAGE_KEY);
          let shouldUpdate = true;

          if (lastLocationStr) {
            try {
              const lastLocation = JSON.parse(lastLocationStr);
              const distance = calculateDistance(
                lastLocation.latitude,
                lastLocation.longitude,
                location.latitude,
                location.longitude,
              );

              // Only update if moved significantly
              if (distance < MIN_DISTANCE_KM) {
                console.log(
                  `📍 Location unchanged (${distance.toFixed(2)}km), skipping update`,
                );
                shouldUpdate = false;
              } else {
                console.log(
                  `📍 Location changed by ${distance.toFixed(2)}km, updating...`,
                );
              }
            } catch (e) {
              console.error("Failed to parse last location:", e);
            }
          }

          if (shouldUpdate) {
            await updateUserLocationAction(
              location.latitude,
              location.longitude,
            );

            // Store new location in localStorage
            localStorage.setItem(
              LOCATION_STORAGE_KEY,
              JSON.stringify(location),
            );

            console.log("✅ Location auto-updated successfully");
          }

          hasUpdatedRef.current = true;
        } catch (error) {
          console.error("Failed to auto-update location:", error);
        }
      };

      updateLocation();
    }
  }, [location, session]);

  // This component doesn't render anything
  return null;
}
