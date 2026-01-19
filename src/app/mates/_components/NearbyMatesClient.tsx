"use client";

import Header from "@/app/mates/_components/Header";
import MateCard from "@/app/components/common/cards/MateCard";
import { Mars, VenusAndMars, Venus } from "lucide-react";
import { useState, useMemo, useRef } from "react";
import { Gender, User } from "@/domain/user/user.schema";
import { getAge } from "@/app/_utils/age";

const AgeRangeSlider = ({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
}) => {
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const minPercent = ((value.min - min) / (max - min)) * 100;
  const maxPercent = ((value.max - min) / (max - min)) * 100;

  const handleMinChange = (newValue: number) => {
    const clampedValue = Math.min(Math.max(newValue, min), value.max - 1);
    onChange({ min: clampedValue, max: value.max });
  };

  const handleMaxChange = (newValue: number) => {
    const clampedValue = Math.max(Math.min(newValue, max), value.min + 1);
    onChange({ min: value.min, max: clampedValue });
  };

  return (
    <div className="w-full">
      {/* Label and Value Display */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-700 font-medium text-lg">Age</span>
        <span className="text-gray-400 text-sm">
          (between {value.min} and {value.max})
        </span>
      </div>

      {/* Slider Container */}
      <div className="relative pt-2 pb-2">
        {/* Background Track */}
        <div ref={trackRef} className="relative h-2 bg-gray-200 rounded-full">
          {/* Active Range Track */}
          <div
            className="absolute h-2 bg-brand rounded-full"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />

          {/* Min Handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer z-10"
            style={{ left: `${minPercent}%` }}
          >
            <div className="w-6 h-6 bg-brand rounded-full shadow-lg border-4 border-white hover:scale-110 transition-transform" />
          </div>

          {/* Max Handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer z-10"
            style={{ left: `${maxPercent}%` }}
          >
            <div className="w-6 h-6 bg-brand rounded-full shadow-lg border-4 border-white hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Hidden Range Inputs for Accessibility */}
        <input
          type="range"
          min={min}
          max={max}
          value={value.min}
          onChange={(e) => handleMinChange(parseInt(e.target.value))}
          className="absolute w-full h-2 opacity-0 cursor-pointer top-0"
          style={{ zIndex: 5 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value.max}
          onChange={(e) => handleMaxChange(parseInt(e.target.value))}
          className="absolute w-full h-2 opacity-0 cursor-pointer top-0"
          style={{ zIndex: 5 }}
        />
      </div>
    </div>
  );
};

const GenderToggle = ({
  gender,
  setGender,
}: {
  gender: Gender;
  setGender: (gender: Gender) => void;
}) => {
  const options = [
    { value: "NON_BINARY" as const, icon: VenusAndMars, label: "All genders" },
    { value: "MALE" as const, icon: Mars, label: "Male" },
    { value: "FEMALE" as const, icon: Venus, label: "Female" },
  ];

  return (
    <div className="bg-gray-800/50 p-1 rounded-full flex gap-1">
      {options.map(({ value, icon: Icon, label }) => {
        const isSelected = gender === value;
        return (
          <button
            key={value}
            onClick={() => setGender(value)}
            aria-label={label}
            aria-pressed={isSelected}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center
              transition-all duration-200 ease-in-out
              ${
                isSelected
                  ? "bg-teal-500 text-white"
                  : "bg-transparent text-gray-400 hover:text-gray-300"
              }
            `}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </div>
  );
};

interface MateFilters {
  gender: Gender;
  ageRange: { min: number; max: number };
  distance: { min: number; max: number };
  interests: string[];
  sort: "distance" | "age" | "name";
  search: string;
}

export default function NearbyMatesClient({
  mates,
  loggedUser,
}: {
  mates: User[];
  loggedUser: User;
}) {
  const [filters, setFilters] = useState<MateFilters>({
    gender: "NON_BINARY",
    ageRange: { min: 18, max: 100 },
    distance: { min: 0, max: 100 },
    interests: [],
    sort: "distance",
    search: "",
  });

  const filteredMates = useMemo(() => {
    return mates.filter((mate) => {
      const age = getAge(mate.profile?.birthday);
      const isAgeInRange =
        age && age >= filters.ageRange.min && age <= filters.ageRange.max;
      const isGenderMatch =
        filters.gender === "NON_BINARY" ||
        filters.gender === mate.profile?.gender;
      const isInterestMatch =
        filters.interests.length === 0 ||
        filters.interests.some((interest) =>
          mate.profile?.persona?.interests.includes(interest),
        );
      return isAgeInRange && isGenderMatch && isInterestMatch;
    });
  }, [mates, filters]);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header with Title and Filters */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-4xl font-bold">Mates</h1>
            <p className="text-gray-400 text-lg mt-1">
              {loggedUser.currentCity?.name || "Bangkok"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AgeRangeSlider
              min={18}
              max={100}
              value={filters.ageRange}
              onChange={(value) => setFilters({ ...filters, ageRange: value })}
            />
            <GenderToggle
              gender={filters.gender}
              setGender={(gender) => setFilters({ ...filters, gender })}
            />
          </div>
        </div>
      </div>

      {/* Grid of Mates */}
      <main className="px-6 pb-24">
        <div className="grid grid-cols-1 gap-4">
          {filteredMates.map((mate) => (
            <MateCard
              key={mate.id}
              mate={mate}
              loggedUser={loggedUser}
              priority={false}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
