"use client";

import "@/components/molecules/CityStamp/styles.css";
import { Plus } from "lucide-react";
import Block from "@/components/atoms/Block";
import Badge from "@/components/atoms/Badge";
import SectionHeader from "@/components/molecules/SectionHeader";
import HorizontalList from "@/components/molecules/HorizontalList";
import PassportStamp from "@/components/molecules/PassportStamp";
import Link from "next/link";
import AddSection from "@/components/molecules/AddSection";
import { TravelHistoryItem } from "@/domain/user/travel-history.service";

export default function TravelHistory({
  travelHistory = [],
  isMyProfile,
}: {
  travelHistory?: TravelHistoryItem[];
  isMyProfile: boolean;
}) {
  const visits = travelHistory;

  return (
    <div className="flex flex-col gap-md">
      <SectionHeader
        title="Travel History"
        linkText={`${visits.length} places`}
        href={isMyProfile ? "/profile/travelc?content=europe" : undefined}
      />
      <HorizontalList className="p-8 items-center h-40">
        {visits.length === 0 && isMyProfile ? (
          <AddSection
            title="Start adding your travel history"
            link={{
              href: "/profile/travelc?content=europe",
              label: "Add your first stamp",
            }}
          />
        ) : visits.length === 0 && !isMyProfile ? (
          <div className="w-full text-center py-4 opacity-40">
            No travel history yet
          </div>
        ) : (
          visits.map((item, index) => {
            const displayDate = item.date
              ? new Date(item.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : `${item.type.toUpperCase()} OF ${item.countryName.toUpperCase()}`;

            const link = item?.countryCode
              ? `/countries/${item.countryCode.toLowerCase()}`
              : `/cities/${item.cityId}`;

            return (
              <Link href={link} key={item.id} className="relative shrink-0">
                <PassportStamp
                  city={item.cityName}
                  country={item.countryName}
                  date={displayDate}
                  index={index}
                  size="sm"
                />
                {item.isCurrent && (
                  <Badge className="absolute -top-2 -right-2">CURRENT</Badge>
                )}
              </Link>
            );
          })
        )}
        {isMyProfile && visits.length > 0 && (
          <Link href="/profile/travelc?content=europe" className="shrink-0">
            <Block className="w-16 h-16 rounded-full bg-surface-secondary border border-dashed border-secondary/30 flex items-center justify-center hover:bg-surface-tertiary transition-colors">
              <Plus className="text-secondary" />
            </Block>
          </Link>
        )}
      </HorizontalList>
    </div>
  );
}
