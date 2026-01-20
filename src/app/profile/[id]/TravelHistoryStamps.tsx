"use client";

import { CityStamp } from "@/app/components/CityStamp";
import "@/app/components/CityStamp/styles.css";
import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";

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
  isOwnProfile?: boolean;
}

import { getCityConfig } from "@/data/cityStamps";
import PassportStamp from "@/app/components/common/PassportStamp";
import Link from "next/link";
import Button from "@/app/components/common/Button";

export default function TravelHistoryStamps({
  userId,
  isOwnProfile,
}: TravelHistoryStampsProps) {
  // ...
  // ... in return ...
  {
    isOwnProfile && (
      <Link href="/travel">
        <Button>
          <Plus size={20} />
        </Button>
      </Link>
    );
  }
  const [visits, setVisits] = useState<TravelHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/users/${userId}/travel-history`);
        if (res.ok) {
          const data = await res.json();
          const rawVisits: TravelHistoryItem[] = data.visits || [];

          // Filter out duplicates: show a city only once per year
          const seen = new Set<string>();
          const filtered = rawVisits.filter((visit) => {
            const year = visit.date
              ? new Date(visit.date).getFullYear()
              : "no-date";
            // Create a unique key for city+year
            // If cityId is null (e.g. older data or just country), fallback to cityName
            const cityKey = visit.cityId || visit.cityName;
            const key = `${cityKey}-${year}`;

            if (seen.has(key)) {
              return false;
            }
            seen.add(key);
            return true;
          });

          setVisits(filtered);
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
        No stamps yet. Start exploring!
        <Link href="/profile/travel">Add cities you visited</Link>
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
      <div className="p-8 flex items-center gap-8 overflow-x-scroll">
        {[...new Set(visits)].map((item, index) => {
          // console.log("item", item);
          const displayDate = item.date
            ? new Date(item.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "undefined";

          // Get config (style + icon) for this city
          const config = getCityConfig(item.cityName);
          console.log(item?.countryCode);

          const link = item?.countryCode
            ? `/countries/${item.countryCode}`
            : `/cities/${item.cityId}`;

          return (
            <Link href={link} key={item.id} className="relative">
              <PassportStamp
                city={item.cityName}
                country={item.countryName}
                date={displayDate}
                index={index}
                size="sm"
              />
              {item.isCurrent && (
                <div className="absolute -top-2 -right-2 bg-brand text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                  CURRENT
                </div>
              )}
            </Link>
          );
        })}

        {isOwnProfile && (
          <Link href="/profile/travelb">
            <div className="w-16 h-16 rounded-full bg-surface-secondary border border-dashed border-secondary/30 flex items-center justify-center hover:bg-surface-tertiary transition-colors">
              <Plus className="text-secondary" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
