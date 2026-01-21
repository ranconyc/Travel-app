"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getStructuredWorld } from "@/lib/utils/world.utils";
import { SelectedItem } from "@/app/components/common/SelectedItem";
import Button from "@/app/components/common/Button";
import { CategoryRow } from "@/app/profile/persona/_components/InterestsStep";
import Modal from "./_components/Modal";
import { travelFormSchema, TravelFormValues } from "./_types/form";
import { TravelFormHeader } from "./_components/TravelFormHeader";
import { CountrySelection } from "./_components/CountrySelection";
import { saveVisitedCountries } from "@/domain/user/user.actions";
import {
  COUNTRY_CODE_TO_NAME,
  COUNTRY_NAME_TO_CODE,
} from "@/data/countryMapping";

const { structure: world, continentOrder: continents } = getStructuredWorld();

export default function TravelFormClient({
  initialUser,
}: {
  initialUser: any;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState<string>("");
  const [selectedSubContinent, setSelectedSubContinent] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const methods = useForm<TravelFormValues>({
    resolver: zodResolver(travelFormSchema),
    mode: "onChange",
    defaultValues: {
      // Map initial codes (from DB) to names (for UI/Checkbox matching against world.json)
      countries: (initialUser?.visitedCountries || []).map(
        (code: string) => COUNTRY_CODE_TO_NAME[code] || code,
      ),
    },
  });

  const { watch, handleSubmit, setValue } = methods;
  const selectedCountries = watch("countries");

  const getCountriesInSubRegion = (continent: string, sub: string) => {
    const { allCountries } = getStructuredWorld();
    return allCountries
      .filter(
        (c) => c.region === continent && (c.subregion || "Antarctic") === sub,
      )
      .map((c) => c.name.common);
  };

  const getContinentSelectedCount = (continent: string) => {
    const subRegions = world[continent] || [];
    const continentCountries = subRegions.flatMap((sub) =>
      getCountriesInSubRegion(continent, sub),
    );
    return selectedCountries.filter((c) => continentCountries.includes(c))
      .length;
  };

  const getSubContinentSelectedCount = (
    continent: string,
    subContinent: string,
  ) => {
    const subContinentCountries = getCountriesInSubRegion(
      continent,
      subContinent,
    );
    return selectedCountries.filter((c) => subContinentCountries.includes(c))
      .length;
  };

  const subContinents = selectedContinent ? world[selectedContinent] : [];

  const countries =
    selectedContinent && selectedSubContinent
      ? selectedSubContinent === `All countries in ${selectedContinent}`
        ? world[selectedContinent].flatMap((sub) =>
            getCountriesInSubRegion(selectedContinent, sub),
          )
        : getCountriesInSubRegion(selectedContinent, selectedSubContinent)
      : [];

  const onSubmit = async (data: TravelFormValues) => {
    setIsSubmitting(true);
    try {
      // Map selected names back to ISO codes for storage
      const countriesAsCodes = data.countries.map(
        (name: string) => COUNTRY_NAME_TO_CODE[name] || name, // Fallback to name if code not found
      );

      const payload = {
        ...data,
        countries: countriesAsCodes,
      };

      const result = await saveVisitedCountries(payload);
      if (result.success) {
        router.push(`/profile/${result.data.userId}`);
        router.refresh();
      } else {
        console.error("Failed to save countries:", result.error);
        // We could add a local error state here if needed
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackWithReset = () => {
    if (selectedSubContinent) {
      setSelectedSubContinent("");
      setSelectedContinent("");
    } else if (selectedContinent) {
      setSelectedContinent("");
    } else {
      router.back();
    }
  };

  const isStepValid = () => {
    return watch("countries").length > 0;
  };

  const selectedCountriesCount = watch("countries")?.length || 0;

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-app-bg p-4 pb-24">
        <TravelFormHeader
          handleBack={handleBackWithReset}
          isModalOpen={isModalOpen}
        />
        <div className="mb-4 pt-20">
          <h1 className="text-xl font-bold mb-3">
            {selectedContinent
              ? "What SubContinents did you travel to?"
              : "What Continents did you travel to?"}
          </h1>
          <p className="mb-8 font-medium text-secondary">
            {selectedContinent
              ? "Select one SubContinent to continue"
              : "Select one Continent to continue"}
          </p>
          {selectedCountriesCount > 0 && (
            <p className="text-sm text-muted">
              {selectedCountriesCount}{" "}
              {selectedCountriesCount === 1 ? "country" : "countries"} selected
            </p>
          )}
        </div>

        {selectedCountries.length > 0 && (
          <div className="mb-8">
            <h1 className="text-xl font-bold mb-4">You&apos;ve been to:</h1>
            <ul className="flex flex-wrap gap-2">
              {selectedCountries.map((country) => (
                <SelectedItem
                  key={country}
                  item={country}
                  onClick={() => {
                    setValue(
                      "countries",
                      selectedCountries.filter((c) => c !== country),
                    );
                    setSelectedSubContinent("");
                  }}
                />
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2 h-fit">
            {selectedContinent && (
              <>
                <CategoryRow
                  key="all-countries"
                  title={`All countries in ${selectedContinent}`}
                  selectedCount={getContinentSelectedCount(selectedContinent)}
                  onClick={() => {
                    setSelectedSubContinent(
                      `All countries in ${selectedContinent}`,
                    );
                    setIsModalOpen(true);
                  }}
                />
                {subContinents.map((subContinent: string) => (
                  <CategoryRow
                    key={subContinent}
                    title={subContinent}
                    selectedCount={getSubContinentSelectedCount(
                      selectedContinent,
                      subContinent,
                    )}
                    onClick={() => {
                      setSelectedSubContinent(subContinent);
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </>
            )}
            {!selectedContinent &&
              continents.map((continent: string) => (
                <CategoryRow
                  key={continent}
                  title={continent}
                  selectedCount={getContinentSelectedCount(continent)}
                  onClick={() => {
                    setSelectedContinent(continent);
                  }}
                />
              ))}
            {isModalOpen && (
              <Modal onClose={() => setIsModalOpen(false)}>
                <h1 id="modal-title" className="text-xl font-bold mb-2">
                  {selectedSubContinent}
                </h1>
                <p className="mb-4 text-sm font-bold text-secondary">
                  Select all the countries you have traveled to
                </p>
                <div className="grid gap-2 h-fit max-h-[350px] overflow-y-auto">
                  <CountrySelection countries={countries} />
                </div>
                <div className="mt-6">
                  <Button
                    className="w-full"
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                  >
                    Done
                  </Button>
                </div>
              </Modal>
            )}
          </div>
          <div className="fixed bottom-0 left-0 right-0 p-4 pb-12 bg-app-bg border-t border-surface">
            <Button
              type="submit"
              // disabled={isSubmitting}
              // disabled={!isStepValid() || isSubmitting}
              className="w-full"
            >
              {isSubmitting
                ? "Saving..."
                : `Submit (${selectedCountriesCount})`}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
