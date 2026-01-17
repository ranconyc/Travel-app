"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import SelectionCard from "@/app/components/form/SelectionCard";
import { TravelFormValues } from "../_types/form";

interface CountrySelectionProps {
  countries: string[];
}

export const CountrySelection = ({ countries }: CountrySelectionProps) => {
  const { watch, setValue } = useFormContext<TravelFormValues>();
  const selectedCountries = watch("countries");

  const toggleCountry = (country: string) => {
    const current = selectedCountries || [];
    if (current.includes(country)) {
      setValue(
        "countries",
        current.filter((c) => c !== country),
        { shouldValidate: true },
      );
    } else {
      setValue("countries", [...current, country], { shouldValidate: true });
    }
  };

  return (
    <div className="grid gap-2 h-fit">
      {countries.map((country: string) => (
        <SelectionCard
          key={country}
          id={country}
          label={country}
          isSelected={selectedCountries?.includes(country) || false}
          onChange={() => toggleCountry(country)}
        />
      ))}
    </div>
  );
};
