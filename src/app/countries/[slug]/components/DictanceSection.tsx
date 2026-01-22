"use client";

import { useGeo } from "@/app/_hooks/useGeo";
import {
  formatFlightTimeLabelFromDistance,
  getDistance,
} from "@/app/_utils/geo";
import { useUser } from "@/app/providers/UserProvider";
import { Country } from "@/domain/country/country.schema";

export default function DictanceSection({ country }: { country: Country }) {
  const loggedUser = useUser();

  const {
    coords,
    error,
    loading: locationLoading,
  } = useGeo({
    persistToDb: true,
    distanceThresholdKm: 1, // Save to DB if user moves more than 1km
    initialUser: loggedUser,
    refreshOnUpdate: true,
  });

  return (
    <div className="text-lg font-bold flex flex-col">
      {(loggedUser?.currentCity?.country as any)?.cca3 ===
      (country as any).cca3 ? (
        <>
          <span>You</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
            here
          </span>
        </>
      ) : (
        <>
          <span>
            {formatFlightTimeLabelFromDistance(
              getDistance(
                (country.coords as any)?.coordinates?.[1] ?? 0,
                (country.coords as any)?.coordinates?.[0] ?? 0,
                coords?.lat ?? 0,
                coords?.lng ?? 0,
              ),
            )}
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
            Flight
          </span>
        </>
      )}
    </div>
  );
}
