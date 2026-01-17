"use client";

import React from "react";
import Button from "@/app/components/common/Button";
import { City } from "@prisma/client";
import { useLocation } from "@/app/providers/LocationProvider";
import { updateUserLocationAction } from "@/domain/user/location.actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CurrentCitySectionProps {
  currentCity: City | null;
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

      const res = await updateUserLocationAction(
        location.latitude,
        location.longitude,
      );

      if (res.success && res.city) {
        toast.success(
          `Updated location to ${res.city.cityName || res.city.label}`,
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

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xs font-bold text-secondary uppercase">
        Current City
      </h2>
      <div className="">
        {currentCity?.name &&(
          <p className="text-app-text font-medium">{currentCity?.name}</p>
        ) }
          <Button
            onClick={handleGetLocation}
            disabled={loading}
            className="flex gap-2 items-center"
          >
            {loading && <Loader2 className="animate-spin w-4 h-4" />}
            Get current city
          </Button>
      
      </div>
    </div>
  );
};
