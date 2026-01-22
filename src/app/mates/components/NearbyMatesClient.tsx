"use client";

import MateCard from "@/app/components/common/cards/MateCard";
import { Mars, VenusAndMars, Venus } from "lucide-react";
import { useState, useMemo } from "react";
import { Gender, User } from "@/domain/user/user.schema";
import { getAge } from "@/app/_utils/age";

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
    <div className="bg-surface p-1 rounded-full flex gap-1">
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
    <div className="min-h-screen">
      {/* Header with Title and Filters */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-secondary text-lg mt-1">
              {loggedUser.currentCity?.name || "Bangkok"}
            </p>
            <h1 className="text-app-text text-4xl font-bold">Mates</h1>
          </div>
          <div className="flex items-center gap-3">
            <GenderToggle
              gender={filters.gender}
              setGender={(gender) => setFilters({ ...filters, gender })}
            />
          </div>
        </div>
      </div>

      {/* Grid of Mates */}
      <main className="px-6 pb-24">
        <div className="grid grid-cols-2 gap-2">
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
