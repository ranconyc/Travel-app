"use client";

import { CityStamp } from "@/app/components/CityStamp";
import "@/app/components/CityStamp/styles.css";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type CityVisit = {
  id: string;
  cityId: string;
  startDate: Date;
  endDate: Date | null;
  city: {
    name: string;
    cityId: string;
    country?: {
      name: string;
      code: string;
    } | null;
  };
};

interface TravelHistoryStampsProps {
  userId: string;
}

// Hash city name to consistently get the same stamp style
function getCityStampVariant(cityName: string) {
  const stampStyles = [
    "circle",
    "oval",
    "hexagon",
    "diamond",
    "rounded-rect",
    "wavy-circle",
    "octagon",
    "square",
    "triangle",
    "dashed-rect",
  ] as const;

  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
    hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % stampStyles.length;
  return stampStyles[index];
}

export default function TravelHistoryStamps({
  userId,
}: TravelHistoryStampsProps) {
  const [visits, setVisits] = useState<CityVisit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/users/${userId}/travel-history`);
        if (res.ok) {
          const data = await res.json();
          setVisits(data.visits || []);
        }
      } catch (error) {
        console.error("Failed to fetch travel history:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin w-6 h-6 text-secondary" />
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div className="text-sm text-secondary opacity-60 py-4">
        No cities visited yet. Start exploring!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xs font-bold text-secondary uppercase">
          Visited Cities
        </h2>
        <p className="text-xs text-secondary">{visits.length} cities</p>
      </div>
      <div className="flex flex-wrap gap-4">
        {visits.map((visit) => {
          const arrivalDate = new Date(visit.startDate).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            },
          );

          return (
            <CityStamp
              key={visit.id}
              cityName={visit.city.name}
              countryName={visit.city.country?.name || ""}
              date={arrivalDate}
              variant={getCityStampVariant(visit.city.name)}
            />
          );
        })}
      </div>
    </div>
  );
}
