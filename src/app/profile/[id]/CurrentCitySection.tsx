"use client";

import React from "react";
import Button from "@/app/components/common/Button";
import { City } from "@prisma/client";
import { useLocation } from "@/app/providers/LocationProvider";
import { updateUserLocationAction } from "@/domain/user/location.actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { CityStamp, stampStyles } from "@/app/components/CityStamp";
import "@/app/components/CityStamp/styles.css";

interface CurrentCitySectionProps {
  currentCity: City | null;
}

// Hash city name to consistently get the same stamp style for each city
function getCityStampVariant(cityName: string) {
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
    hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % stampStyles.length;
  return stampStyles[index];
}

export const CurrentCitySection = ({
  currentCity,
}: CurrentCitySectionProps) => {
  const { requestLocation, isLoading: isLocLoading } = useLocation();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleGetLocation = async () => {
    setIsUpdating(true);
    try {
      const location = await requestLocation();
      if (!location) {
        setIsUpdating(false);
        return; // requestLocation handles toasts
      }

      const res = await updateUserLocationAction({
        lat: location.latitude,
        lng: location.longitude,
      });

      if (res.success) {
        const detected = res.data;
        toast.success(
          `Updated location to ${detected.cityName || (detected as any).label}`,
        );
      } else {
        toast.error(res.error || "Failed to identify city");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const loading = isLocLoading || isUpdating;

  // Format date
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xs font-bold text-secondary uppercase">
        Current City
      </h2>

      <div className="flex flex-wrap gap-3">
        {currentCity ? (
          <CityStamp
            cityName={currentCity.name}
            countryName="Country" // You can pass actual country name when available
            date={today}
            variant={getCityStampVariant(currentCity.name)}
          />
        ) : (
          <div className="text-sm text-secondary opacity-60">
            No location set
          </div>
        )}
      </div>

      <Button
        onClick={handleGetLocation}
        disabled={loading}
        className="flex gap-2 items-center w-fit"
      >
        {loading && <Loader2 className="animate-spin w-4 h-4" />}
        {currentCity ? "Update location" : "Get current city"}
      </Button>
    </div>
  );
};
