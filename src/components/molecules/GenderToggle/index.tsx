"use client";

import React, { memo } from "react";
import { Mars, VenusAndMars, Venus } from "lucide-react";
import { Gender } from "@/domain/user/user.schema";

interface GenderToggleProps {
  gender: Gender | "NON_BINARY";
  setGender: (gender: Gender | "NON_BINARY") => void;
}

const GenderToggle = memo(({ gender, setGender }: GenderToggleProps) => {
  const options = [
    { value: "NON_BINARY" as const, icon: VenusAndMars, label: "All genders" },
    { value: "MALE" as const, icon: Mars, label: "Male" },
    { value: "FEMALE" as const, icon: Venus, label: "Female" },
  ];

  return (
    <div className="bg-bg-sub p-1 rounded-full flex gap-1 shadow-inner border border-stroke">
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
              transition-all duration-300 ease-out transform
              ${
                isSelected
                  ? "bg-brand text-white shadow-soft scale-105"
                  : "bg-transparent text-txt-sec hover:text-txt-main hover:bg-bg-main"
              }
            `}
          >
            <Icon size={18} strokeWidth={isSelected ? 2.5 : 2} />
          </button>
        );
      })}
    </div>
  );
});

GenderToggle.displayName = "GenderToggle";

export default GenderToggle;
