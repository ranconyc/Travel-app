"use client";
import Button from "@/app/components/common/Button";
import { Autocomplete } from "@/app/components/form/Autocomplete";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import React, { useEffect } from "react";

type Props = {};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    OPERATIONAL: "bg-green-500",
    CLOSED_TEMPORARILY: "bg-red-500",
    CLOSED_PERMANENTLY: "bg-gray-500",
  };

  if (!map[status]) return null;

  return (
    <span className={`${map[status]} text-white px-2 py-1 rounded text-sm`}>
      {status.replace("_", " ").toLowerCase()}
    </span>
  );
}

function PlaceItem({ place, onClick }: { place: any; onClick: () => void }) {
  const {
    name,
    place_id,
    formatted_address,
    rating,
    user_ratings_total,
    business_status,
    opening_hours,
  } = place;

  return (
    <li className="m-4 p-4 border rounded-lg cursor-pointer" onClick={onClick}>
      <div className="flex justify-between">
        <h2 className="font-bold">{name}</h2>

        {rating && (
          <div className="flex items-center gap-1 text-gray-500">
            {rating} <Star size={16} /> ({user_ratings_total})
          </div>
        )}
      </div>

      <p className="text-gray-500">{formatted_address}</p>

      <StatusBadge status={business_status} />

      <p
        className={opening_hours?.open_now ? "text-green-500" : "text-red-500"}
      >
        {opening_hours?.open_now ? "Open now" : "Closed"}
      </p>
    </li>
  );
}

export default function Page({}: Props) {
  const [query, setQuery] = React.useState("");

  const url = `/api/google/places?q=${query}`;
  const urlIq = `/api/locationiq/search?q=${query}`;

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["places", query],
    queryFn: async () => {
      const res = await fetch(url, { next: { revalidate: 60 } });
      if (!res.ok) throw new Error("Failed to fetch places");
      return res.json();
    },
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div>
      <h1>Destinations</h1>
      <Autocomplete
        name="activity"
        placeholder="Type activity name"
        onQueryChange={setQuery}
      />
      {/* <Button onClick={handleCreateActivity}>Create Activity</Button> */}
      {isLoading && <p>Loading…</p>}
      {error && <p className="text-red-500">Failed to load places</p>}
      <ul>
        {data.map(
          (
            place: {
              name: string;
              place_id: string;
              formatted_address: string;
              formatted_phone_number: string;
              website: string;
              rating: number;
              user_ratings_total: number;
              business_status: string;
              icon_background_color: string;
              opening_hours: { open_now: boolean };
            },
            index: number
          ) => {
            console.log(`place ${index}`, place);
            return (
              <PlaceItem
                key={place.place_id}
                place={place}
                onClick={() => {
                  console.log("selected place", place);
                }}
              />
            );
          }
        )}
      </ul>
    </div>
  );
}
