"use client";

import { CityStamp } from "@/app/components/CityStamp";
import "@/app/components/CityStamp/styles.css";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type TravelHistoryItem = {
  id: string;
  type: "city" | "country";
  cityId: string | null;
  cityName: string;
  countryName: string;
  countryCode: string;
  date: Date | null;
  isCurrent: boolean;
};

interface TravelHistoryStampsProps {
  userId: string;
}

import { getCityConfig } from "@/data/cityStamps";

export default function TravelHistoryStamps({
  userId,
}: TravelHistoryStampsProps) {
  const [visits, setVisits] = useState<TravelHistoryItem[]>([]);
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
          Travel History
        </h2>
        <p className="text-xs text-secondary">{visits.length} places</p>
      </div>
      <div className="flex flex-wrap gap-4">
        {visits.map((item) => {
          const displayDate = item.date
            ? new Date(item.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : undefined;

          // Get config (style + icon) for this city
          const config = getCityConfig(item.cityName);

          return (
            <div key={item.id} className="relative">
              <CityStamp
                cityName={item.cityName}
                countryName={item.countryName}
                date={displayDate}
                variant={config.variant}
                icon={config.icon}
              />
              {item.isCurrent && (
                <div className="absolute -top-2 -right-2 bg-brand text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                  CURRENT
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
