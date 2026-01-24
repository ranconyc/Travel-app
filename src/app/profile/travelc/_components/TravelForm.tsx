"use client";

import Button from "@/components/atoms/Button";
import SelectionCard from "@/components/atoms/SelectionCard";
import { useUser } from "@/app/providers/UserProvider";
import { getStructuredWorld, Country } from "@/lib/utils/world.utils";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import SelectedItem from "@/components/molecules/SelectedItem";

const {
  structure: structuredWorld,
  continentOrder,
  allCountries: world,
} = getStructuredWorld();

const getCountryByCode = (code: string) => {
  return world.find((country) => country.cca2 === code);
};

export default function TravelForm({
  selectedRegion,
  review,
}: {
  selectedRegion: string;
  review: boolean;
}) {
  const user = useUser();
  const { watch, handleSubmit, setValue } = useForm<{ countries: string[] }>({
    defaultValues: {
      countries: user?.visitedCountries || [],
    },
  });

  const router = useRouter();

  const selectedCountries = watch("countries");
  const toggleCountry = (country: { cca2: string }) => {
    const current = selectedCountries || [];
    if (current.includes(country.cca2)) {
      setValue(
        "countries",
        current.filter((c) => c !== country.cca2),
        { shouldValidate: true },
      );
    } else {
      setValue("countries", [...current, country.cca2], {
        shouldValidate: true,
      });
    }
  };

  const toggleSubRegion = (subRegion: string) => {
    const current = selectedCountries || [];
    const countriesInSubRegion = world.filter(
      (country) => country.subregion === subRegion,
    );
    const countriesInSubRegionCodes = countriesInSubRegion.map(
      (country) => country.cca2,
    );
    const allSelected = countriesInSubRegionCodes.every((code) =>
      current.includes(code),
    );
    if (allSelected) {
      setValue(
        "countries",
        current.filter((code) => !countriesInSubRegionCodes.includes(code)),
        { shouldValidate: true },
      );
    } else {
      setValue("countries", [...current, ...countriesInSubRegionCodes], {
        shouldValidate: true,
      });
    }
  };
  const regionIndex = continentOrder.indexOf(selectedRegion);
  const isLastRegion = regionIndex === continentOrder.length - 1;

  const hendleSkip = () => {
    if (isLastRegion) {
      router.push("/profile/travelc?review=true");
    } else {
      router.push(
        "/profile/travelc?continent=" + continentOrder[regionIndex + 1],
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit((data) => console.log(data))}
      className="p-4 pb-20"
    >
      {review ? (
        <div>
          <p>You been to {selectedCountries.length} countries</p>
          <div className="flex flex-wrap gap-2">
            {selectedCountries.map((country) => {
              const countryData = getCountryByCode(country);
              return (
                <SelectedItem
                  key={country}
                  item={
                    countryData
                      ? `${countryData.flag} ${countryData.name.common}`
                      : ""
                  }
                  onClick={() => toggleCountry(countryData!)}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between my-4">
            <h2 className="text-xl font-bold">{selectedRegion}</h2>
            {/* todo on select all add all countres in the subregion */}
            {isLastRegion ? null : (
              <p className="text-sm text-muted" onClick={() => hendleSkip()}>
                skip {">"}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {world.map((country) => {
              return country.region === selectedRegion ? (
                <SelectionCard
                  className="h-full"
                  type="checkbox"
                  key={country.cca2}
                  id={country.cca2}
                  label={
                    country.name.common.length > 20
                      ? country.cca3
                      : country.name.common
                  }
                  icon={country.flag}
                  isSelected={selectedCountries.includes(country.cca2)}
                  onChange={() => toggleCountry(country)}
                />
              ) : null;
            })}
          </div>
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-app-bg border-t border-gray-200">
        <Button
          type={review ? "submit" : "button"}
          className="w-full"
          onClick={review ? undefined : hendleSkip}
        >
          {review ? "Submit" : selectedCountries.length === 0 ? "Skip" : "Next"}
        </Button>
      </div>
    </form>
  );
}
