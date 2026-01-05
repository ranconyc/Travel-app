"use client";
import Button from "@/app/component/common/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useMemo, useState } from "react";

// --- Types ---
type City = {
  name: string;
};

type Stop = {
  arrivalDate: Date | string;
  departureDate: Date | string;
  city?: City; // Optional based on your data structure
};

type Trip = {
  startDate: Date | string;
  endDate: Date | string;
  stops: Stop[];
};

type Props = {
  trip: Trip;
  colors: string[]; // Receive colors from parent to match the list
};

// --- Helper: Strip time for accurate date comparison ---
const resetTime = (date: Date | string | null): number => {
  if (!date) return 0;
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export default function Calender({ trip, colors }: Props) {
  // Initialize view to the trip start date or today
  const initialDate = trip.startDate ? new Date(trip.startDate) : new Date();
  const [year, setYear] = useState(initialDate.getFullYear());
  const [month, setMonth] = useState(initialDate.getMonth());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfTheWeek = ["S", "M", "T", "W", "T", "F", "S"];

  // --- Generate Calendar Grid ---
  const days = useMemo(() => {
    const calendarDays: Date[] = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayIndex = firstDayOfMonth.getDay(); // 0 for Sunday
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

    // Previous month filler
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = startingDayIndex - 1; i >= 0; i--) {
      calendarDays.push(new Date(year, month - 1, prevMonthLastDate - i));
    }

    // Current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      calendarDays.push(new Date(year, month, i));
    }

    // Next month filler to complete the grid (up to 42 cells usually)
    const remainingSlots = 42 - calendarDays.length;
    for (let i = 1; i <= remainingSlots; i++) {
      calendarDays.push(new Date(year, month + 1, i));
    }

    return calendarDays;
  }, [year, month]);

  // --- Navigation Handlers ---
  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  // --- Styles Logic ---
  const getDayStyles = (day: Date) => {
    const dayTime = resetTime(day);
    let classes = "text-gray-700 hover:bg-gray-100";
    let styleObj = {};
    let label = null;
    let isStopStart = false;

    // Check if day belongs to any stop
    trip.stops.forEach((stop, index) => {
      const start = resetTime(stop.arrivalDate);
      const end = resetTime(stop.departureDate);
      const colorClass = colors[index % colors.length]; // Cycle colors if stops > colors

      if (dayTime >= start && dayTime <= end) {
        // Base color style
        classes = `text-white font-bold font-medium ${colorClass}`;

        // Determine rounded corners
        const isFirstDay = dayTime === start;
        const isLastDay = dayTime === end;
        console.log("f ,l ", day, isFirstDay, isLastDay);
        if (isFirstDay && isLastDay) {
          classes += " rounded-full"; // Single day stop
          isStopStart = true;
        } else if (isFirstDay) {
          classes += " rounded-l-full";
          isStopStart = true;
        } else if (isLastDay) {
          classes += " rounded-r-full";
        } else {
          classes += " rounded-none"; // Middle days are square
        }
      }
    });

    // Dim days not in current month
    if (day.getMonth() !== month) {
      classes += " opacity-30";
    }

    return { classes, isStopStart };
  };

  // console.log("fff", resetTime());

  return (
    <div className="w-full max-w-md mx-auto bg-white p-4 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-gray-800">
            {monthNames[month]}
          </span>
          <span className="text-xl font-normal text-gray-500">{year}</span>
        </div>
        <div className="flex gap-1">
          <Button
            icon={<ChevronLeft size={20} />}
            onClick={handlePrevMonth}
            variant="ghost"
          />
          <Button
            icon={<ChevronRight size={20} />}
            onClick={handleNextMonth}
            variant="ghost"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-4 gap-x-1 mb-2">
        {/* Day Names */}
        {daysOfTheWeek.map((d, i) => (
          <div
            key={i}
            className="text-center text-sm font-semibold text-gray-500 mb-2"
          >
            {d}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, idx) => {
          const { classes, isStopStart } = getDayStyles(day);

          return (
            <div
              key={idx}
              className="relative h-10 flex flex-col items-center justify-center"
            >
              <div
                className={`w-10 h-10 flex items-center justify-center text-sm transition-all ${classes}`}
              >
                {day.getDate()}
              </div>
              {/* Optional "Start" Label logic - applies to the very first stop or specific logic */}

              {isStopStart && resetTime(day) === resetTime(trip.startDate) && (
                <span className="absolute -bottom-1 text-[10px] font-bold text-green-700 bg-white/80 px-1 rounded shadow-sm leading-tight">
                  Start
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
