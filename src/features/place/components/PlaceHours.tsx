import React from "react";
import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";
import { Clock, CalendarCheck } from "lucide-react";

interface PlaceHoursProps {
  openingHours: any; // Using any to match the loose JSON schema
}

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABELS: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

export default function PlaceHours({ openingHours }: PlaceHoursProps) {
  if (!openingHours) return null;

  // Simple "Open Now" logic could be added here if we had date-fns or similar
  // keeping it visual for now.

  return (
    <Block>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-secondary" />
        <Typography
          variant="h3"
          className="text-upheader font-bold text-secondary uppercase tracking-wider margin-0"
        >
          Opening Hours
        </Typography>
      </div>

      <div className="space-y-3">
        {DAYS.map((day) => {
          const dayData = openingHours[day];
          const isClosed = dayData?.closed === true;
          const times = dayData?.times;

          // If no data, assume closed or unknown? Let's skip if completely missing
          // But usually we want to show all days.
          if (!dayData) return null;

          // Highlight today (server side rendering, so timezone might be tricky, skip highlighting for now)

          return (
            <div
              key={day}
              className="flex justify-between items-center py-2 border-b border-surface-secondary/50 last:border-0"
            >
              <span className="text-sm font-medium text-txt-secondary w-24">
                {DAY_LABELS[day]}
              </span>
              <div className="flex-1 flex justify-end gap-2">
                {isClosed ? (
                  <span className="text-sm font-bold text-error/80 px-2 py-0.5 bg-error/10 rounded">
                    Closed
                  </span>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    {times?.map(
                      (t: { open: string; close: string }, i: number) => (
                        <span key={i} className="text-sm text-txt-main">
                          {t.open} - {t.close}
                        </span>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Block>
  );
}
