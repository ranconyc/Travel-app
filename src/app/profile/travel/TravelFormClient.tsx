"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getStructuredWorld } from "@/lib/utils/world.utils";
import Button from "@/components/atoms/Button";
import { CountrySelector } from "@/components/organisms/forms";
import { travelFormSchema, TravelFormValues } from "./_types/form";
import { TravelFormHeader } from "./_components/TravelFormHeader";
import { saveVisitedCountries } from "@/domain/user/user.actions";
import {
  COUNTRY_CODE_TO_NAME,
  COUNTRY_NAME_TO_CODE,
} from "@/data/countryMapping";

export default function TravelFormClient({
  initialUser,
}: {
  initialUser: any;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get all available countries for the selector
  const { allCountries } = getStructuredWorld();
  const availableCountryNames = allCountries.map((c) => c.name.common);

  const methods = useForm<TravelFormValues>({
    resolver: zodResolver(travelFormSchema),
    mode: "onChange",
    defaultValues: {
      // Map initial codes (from DB) to names (for UI)
      countries: (initialUser?.visitedCountries || []).map(
        (code: string) => COUNTRY_CODE_TO_NAME[code] || code,
      ),
    },
  });

  const { watch, handleSubmit, setValue } = methods;
  const selectedCountries = watch("countries");

  const onSubmit = async (data: TravelFormValues) => {
    setIsSubmitting(true);
    try {
      // Map selected names back to ISO codes for storage
      const countriesAsCodes = data.countries.map(
        (name: string) => COUNTRY_NAME_TO_CODE[name] || name,
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
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-app-bg p-4 pb-24">
        <TravelFormHeader
          handleBack={() => router.back()}
          isModalOpen={false}
        />

        <div className="mb-4 pt-20">
          <h1 className="text-xl font-bold mb-3">Where have you traveled?</h1>
          <p className="mb-8 font-medium text-secondary">
            Search and select all the countries you've visited
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-20">
            <CountrySelector
              value={selectedCountries}
              onChange={(countries) => setValue("countries", countries)}
              availableCountries={availableCountryNames}
            />
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 pb-12 bg-app-bg border-t border-surface">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting
                ? "Saving..."
                : `Submit (${selectedCountries.length})`}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
