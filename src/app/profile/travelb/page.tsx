"use client";

import { getStructuredWorld, Country } from "@/lib/utils/world.utils";
import SelectionCard from "@/app/components/form/SelectionCard";
import { useForm } from "react-hook-form";
import ProgressBar from "../persona/_components/ProgressBar";
import Button from "@/app/components/common/Button";

const {
  structure: structuredWorld,
  continentOrder,
  allCountries: world,
} = getStructuredWorld();

export default function TravelFormB() {
  const { watch, handleSubmit, setValue } = useForm<{ countries: string[] }>({
    defaultValues: {
      countries: [],
    },
  });

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

  return (
    <div className="">
      <header className="sticky top-0 left-0 right-0 bg-app-bg border-b border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between">
          <Button variant="back" />
          {/* <ProgressBar currentStep={1} totalSteps={5} /> */}
        </div>
        <h1 className="text-2xl font-bold mb-2">
          Tell us about your jerny so far,
        </h1>
        <p>select all the countries you visited</p>
      </header>

      <form
        onSubmit={handleSubmit((data) => console.log(data))}
        className="p-4 pb-20"
      >
        {continentOrder.map((region) => (
          <div key={region} className="mb-8">
            {/* הצגת היבשת */}
            <h2 className="text-2xl font-bold mb-3">{region}</h2>

            {/* הצגת תת-האזורים של אותה יבשת */}
            <div className="grid grid-col-1 gap-6">
              {structuredWorld[region].map((sub) => (
                <div key={sub} className="grid grid-col-1 gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg text-secondary mb-2">
                      {sub || "Antarctic"}
                    </h3>
                    {/* todo on select all add all countres in the subregion */}
                    <p
                      className="text-sm text-muted"
                      onClick={() => toggleSubRegion(sub || "Antarctic")}
                    >
                      Select all
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {world
                      .filter((country) => country.subregion === sub)
                      .map((country) => {
                        console.log(country);
                        return country;
                      })
                      .map((country) => (
                        <SelectionCard
                          type="checkbox"
                          key={country.cca2}
                          id={country.cca2}
                          label={country.name.common}
                          isSelected={selectedCountries.includes(country.cca2)}
                          onChange={() => toggleCountry(country)}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-app-bg border-t border-gray-200">
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
