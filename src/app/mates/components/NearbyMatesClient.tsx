"use client";

import MateCard from "@/components/molecules/MateCard";
import { Mars, VenusAndMars, Venus } from "lucide-react";
import { useState, useMemo } from "react";
import { Gender, User } from "@/domain/user/user.schema";
import { getAge } from "@/domain/shared/utils/age";
import Typography from "@/components/atoms/Typography";

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
      // Cast persona to Record since it's stored as Json in Prisma
      const persona = (mate.profile?.persona || {}) as Record<string, unknown>;
      const interests = (persona.interests || []) as string[];
      const isInterestMatch =
        filters.interests.length === 0 ||
        filters.interests.some((interest) => interests.includes(interest));
      return isAgeInRange && isGenderMatch && isInterestMatch;
    });
  }, [mates, filters]);

  return (
    <div className="min-h-screen">
      {/* Header with Title and Filters */}
      <header className="bg-surface p-lg pt-xxl sticky top-0 left-0 right-0 z-50 border-b border-stroke shadow-soft mb-xl">
        <div className="flex items-center justify-between">
          <div className="flex flex-col justify-center mb-lg">
            <Typography variant="h3" className="normal-case text-txt-sec">
              {loggedUser.currentCity?.name || "Worldwide"}
            </Typography>
            <Typography variant="h1" className="text-txt-main">
              Mates
            </Typography>
          </div>
          <div className="flex items-center gap-3">
            <GenderToggle
              gender={filters.gender}
              setGender={(gender) => setFilters({ ...filters, gender })}
            />
          </div>
        </div>
      </header>

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
