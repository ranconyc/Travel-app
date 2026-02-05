"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/providers/UserProvider";
import { useLocation } from "@/app/providers/LocationProvider";
import { useUpdateUserLocation } from "@/domain/user/user.hooks";
import { calculateHaversineDistance } from "@/lib/utils/geo.utils";

const LOCATION_STORAGE_KEY = "last_location";
const MIN_DISTANCE_KM = 5; // Only update if moved more than 5km

export default function AutoLocationUpdater() {
  const user = useUser();
  const { location } = useLocation();
  const { mutateAsync: updateUserLocation } = useUpdateUserLocation();
  const router = useRouter();
  const hasUpdatedRef = useRef(false);

  // Reset the update flag when the user changes (e.g., login/logout)
  useEffect(() => {
    hasUpdatedRef.current = false;
  }, [user?.id]);

  useEffect(() => {
    // Only update if user is logged in and we have location
    if (user && location && !hasUpdatedRef.current) {
      const updateLocation = async () => {
        try {
          // 1. Check if user already has location in DB
          const hasLocationInDb = !!user.currentLocation;

          // 2. Get last location from localStorage
          const lastLocationStr = localStorage.getItem(LOCATION_STORAGE_KEY);
          let shouldUpdate = !hasLocationInDb; // Force update if not in DB

          if (hasLocationInDb && lastLocationStr) {
            try {
              const lastLocation = JSON.parse(lastLocationStr);
              const distance = calculateHaversineDistance(
                lastLocation.latitude,
                lastLocation.longitude,
                location.latitude,
                location.longitude,
              );

              // Only update if moved significantly
              if (distance >= MIN_DISTANCE_KM) {
                console.log(
                  `📍 Location changed by ${distance.toFixed(2)}km, updating...`,
                );
                shouldUpdate = true;
              } else {
                console.log(
                  `📍 Location unchanged (${distance.toFixed(2)}km), skipping update`,
                );
              }
            } catch (e) {
              console.error("Failed to parse last location:", e);
              shouldUpdate = true;
            }
          }

          if (shouldUpdate) {
            console.log(
              `📍 Auto-updating location... (In DB: ${hasLocationInDb})`,
            );
            await updateUserLocation({
              lat: location.latitude,
              lng: location.longitude,
            });

            // Store new location in localStorage
            localStorage.setItem(
              LOCATION_STORAGE_KEY,
              JSON.stringify(location),
            );

            console.log("✅ Location auto-updated successfully");
            router.refresh(); // Refresh server components
          }

          hasUpdatedRef.current = true;
        } catch (error) {
          console.error("Failed to auto-update location:", error);
        }
      };

      updateLocation();
    }
  }, [location, user, updateUserLocation, router]);

  // This component doesn't render anything
  return null;
}
