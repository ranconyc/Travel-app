"use client";
import worldData from "../../data/world.json";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { SelectedItem, SelectionCard, Button } from "../mode/page";
import { CategoryRow } from "../interests/_components/StepOne";
import Modal from "./_components/Modal";

// Form Schema
const travelFormSchema = z.object({
  countries: z.array(z.string()).min(1, "Please select at least one country"),
});

type TravelFormValues = z.infer<typeof travelFormSchema>;

// Form Header Component
const FormHeader = ({
  handleBack,
  isModalOpen,
}: {
  handleBack: () => void;
  isModalOpen: boolean;
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-app-bg/80 backdrop-blur-md z-40 px-4 py-6">
      <div className="flex items-center gap-4 max-w-2xl mx-auto">
        <button
          onClick={handleBack}
          disabled={isModalOpen}
          className="p-1 hover:bg-surface rounded-full transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

// Step 3: Country Selection with react-hook-form
const CountrySelection = ({ countries }: { countries: string[] }) => {
  const { watch, setValue } = useFormContext<TravelFormValues>();
  const selectedCountries = watch("countries");

  const toggleCountry = (country: string) => {
    const current = selectedCountries || [];
    if (current.includes(country)) {
      setValue(
        "countries",
        current.filter((c) => c !== country),
        { shouldValidate: true }
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

// Type assertion for the world data
type WorldData = Record<string, Record<string, string[]>>;
const world = worldData as WorldData;

export default function Travel() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState<string>("");
  const [selectedSubContinent, setSelectedSubContinent] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getContinentSelectedCount = (continent: string) => {
    const continentCountries = Object.values(world[continent]).flat();
    return selectedCountries.filter((c) => continentCountries.includes(c))
      .length;
  };

  const getSubContinentSelectedCount = (
    continent: string,
    subContinent: string
  ) => {
    const subContinentCountries = world[continent][subContinent];
    return selectedCountries.filter((c) => subContinentCountries.includes(c))
      .length;
  };

  const continents = Object.keys(world);
  const subContinents = selectedContinent
    ? Object.keys(world[selectedContinent])
    : [];
  const countries =
    selectedContinent && selectedSubContinent
      ? world[selectedContinent][selectedSubContinent]
      : [];

  const methods = useForm<TravelFormValues>({
    resolver: zodResolver(travelFormSchema),
    mode: "onChange",
    defaultValues: {
      countries: [],
    },
  });

  const { watch, handleSubmit, setValue } = methods;

  const selectedCountries = watch("countries");

  const onSubmit = async (data: TravelFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Selected countries:", data.countries);
      // TODO: Call server action to save countries
      // const result = await saveVisitedCountries(data);
      router.push("/profile");
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackWithReset = () => {
    console.log("handleBackWithReset", selectedSubContinent, selectedContinent);
    if (selectedSubContinent) {
      setSelectedSubContinent("");
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
        <FormHeader
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
        {/* Show selected countries */}
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
                      selectedCountries.filter((c) => c !== country)
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
            {selectedContinent
              ? subContinents.map((subContinent: string) => (
                  <CategoryRow
                    key={subContinent}
                    title={subContinent}
                    selectedCount={getSubContinentSelectedCount(
                      selectedContinent,
                      subContinent
                    )}
                    onClick={() => {
                      setSelectedSubContinent(subContinent);
                      setIsModalOpen(true);
                    }}
                  />
                ))
              : continents.map((continent: string) => (
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
              disabled={!isStepValid() || isSubmitting}
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

//  {continents.map((continent) => (
//           <li key={continent}>{continent}</li>
//         ))}
