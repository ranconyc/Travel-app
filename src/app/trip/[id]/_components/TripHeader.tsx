"use client";

import React, { useState } from "react";
import HeaderWrapper from "@/app/component/common/Header";
import { format, addDays, isSameDay } from "date-fns";
import { updateTripAction } from "@/domain/trip/trip.actions";

// Simple Switch if not available
function SimpleSwitch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (c: boolean) => void;
}) {
  return (
    <button
      onClick={() => onCheckedChange(!checked)}
      className={`w-11 h-6 flex items-center rounded-full px-1 transition-colors ${
        checked ? "bg-blue-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

type Props = {
  trip: any; // Type as needed
};

export default function TripHeader({ trip }: Props) {
  const isDayTrip =
    trip.startDate &&
    trip.endDate &&
    isSameDay(new Date(trip.startDate), new Date(trip.endDate));
  const [loading, setLoading] = useState(false);

  async function handleToggle(isDayTripNow: boolean) {
    setLoading(true);
    try {
      if (isDayTripNow) {
        // Converting to Day Trip: Set End Date = Start Date
        // We use trip.startDate or today
        const baseDate = trip.startDate ? new Date(trip.startDate) : new Date();
        await updateTripAction(trip.id, {
          startDate: baseDate,
          endDate: baseDate,
        });
      } else {
        // Converting to Multi-day: Set End Date = Start Date + 1 Day (if they were same)
        // If they were already different (shouldn't happen if we are toggling FROM day trip), just keep logic safe
        const baseDate = trip.startDate ? new Date(trip.startDate) : new Date();
        const newEnd = addDays(baseDate, 3); // Default to a long weekend? Or just 1 day? User can edit later. Let's do 1 week or something visible.
        // Actually, let's just make it +3 days for "Vacation" feel
        await updateTripAction(trip.id, {
          startDate: baseDate,
          endDate: newEnd,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const dateRange =
    trip.startDate && trip.endDate
      ? `${format(new Date(trip.startDate), "MMM d")}${
          !isDayTrip
            ? ` - ${format(new Date(trip.endDate), "MMM d, yyyy")}`
            : `, ${format(new Date(trip.startDate), "yyyy")}`
        }`
      : "Dates TBD";

  return (
    <HeaderWrapper>
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-lg font-bold ">{trip.name || "Untitled Trip"}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <p>{isDayTrip ? "Day Trip" : "Vacation"}</p>
          {trip.user && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <p>Created by {trip.user.firstName || trip.user.name}</p>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <span
            className={`text-sm font-medium ${
              isDayTrip ? "text-gray-900" : "text-gray-400"
            }`}
          >
            Day Trip
          </span>
          <SimpleSwitch
            checked={!isDayTrip}
            onCheckedChange={(checked) => !loading && handleToggle(!checked)}
          />
          <span
            className={`text-sm font-medium ${
              !isDayTrip ? "text-gray-900" : "text-gray-400"
            }`}
          >
            Vacation
          </span>
        </div>
      </div>
    </HeaderWrapper>
  );
}
