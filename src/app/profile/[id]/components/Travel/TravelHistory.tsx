"use client";

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

import PassportStamp from "@/app/components/common/PassportStamp";
import Link from "next/link";
import { useProfileUser, useIsMyProfile } from "../../store/useProfileStore";

const NoHistoryMessage = () => {
  return (
    <div className="bg-surface/50 p-4 rounded-xl border-2 border-dashed border-surface-secondary">
      <p className="text-sm text-secondary">
        Start adding your travel history
        <Link
          href="/profile/travelb?content=europe"
          className="ml-2 text-brand font-bold hover:underline"
        >
          Add your first stamp
        </Link>
      </p>
    </div>
  );
};

export default function TravelHistory({
  travelHistory,
}: {
  travelHistory?: TravelHistoryItem[];
}) {
  const profileUser = useProfileUser();
  const isMyProfile = useIsMyProfile();
  const userId = profileUser?.id;
  const [visits, setVisits] = useState<TravelHistoryItem[]>(
    travelHistory || [],
  );
  const [loading, setLoading] = useState(!travelHistory);

  useEffect(() => {
    if (travelHistory || !userId) return;
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
  }, [userId, travelHistory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin w-6 h-6 text-secondary" />
      </div>
    );
  }

  if (visits.length === 0) {
    return <NoHistoryMessage />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="header-2">Travel History</h2>
        <p className="subheader">{visits.length} places</p>
      </div>
      <div className="p-8 flex items-center gap-8 overflow-x-scroll no-scrollbar">
        {visits.map((item, index) => {
          const displayDate = item.date
            ? new Date(item.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : `${item.type.toUpperCase()} OF ${item.countryName.toUpperCase()}`;

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

        {isMyProfile && (
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
