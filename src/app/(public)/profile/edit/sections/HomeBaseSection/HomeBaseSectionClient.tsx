"use client";

import { memo, useEffect } from "react";
import { useFormContext, useController } from "react-hook-form";
import { Autocomplete, AutoOption } from "@/components/molecules/Autocomplete";
import type { CompleteProfileFormValues } from "@/domain/user/completeProfile.schema";

// Extends base AutoOption with city-specific fields
type CityAutoOption = AutoOption & {
  source?: "db" | "external";
  dbCityId?: string;
  meta?: {
    // Basic location info
    name: string;
    countryName: string;
    countryCode: string;
    lat: number;
    lng: number;

    // LocationIQ specific fields
    placeId?: string;
    osmId?: string;
    osmType?: string;
    display_place?: string;
    display_name?: string;

    // Address components
    address?: {
      city?: string;
      state?: string;
      postcode?: string;
      country?: string;
      country_code?: string;
    };

    // Geographic data
    boundingbox?: string[] | number[];
  };
};

function HomeBaseSection() {
  // Access full form so we can also set homeBaseCityId + homeBaseLocation
  const { control, setValue, watch } =
    useFormContext<CompleteProfileFormValues>();

  // Connect "homeBase" text field to RHF
  const { field, fieldState } = useController<CompleteProfileFormValues>({
    control,
    name: "homeBase",
  });

  // Watch for existing homeBaseCityId to ensure proper initialization
  const homeBaseCityId = watch("homeBaseCityId");
  const homeBase = watch("homeBase");

  // Initialize autocomplete state when there's an existing city
  useEffect(() => {
    if (homeBaseCityId && homeBase && !field.value) {
      // Ensure the field value is set to the display name
      field.onChange(homeBase);
    }
  }, [homeBaseCityId, homeBase, field]);

  // Load options for autocomplete (DB first, then external)
  const searchCities = async (q: string, signal: AbortSignal) => {
    const trimmed = q.trim();
    if (!trimmed || trimmed.length < 2) return [];

    const res = await fetch(
      `/api/cities/search?q=${encodeURIComponent(trimmed)}`,
      { signal },
    );

    if (!res.ok) {
      console.error("Failed to fetch cities", res.status);
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    // Normalize into CityAutoOption shape
    return data.map(
      (c: any): CityAutoOption => ({
        id: String(c.id),
        label: String(c.label),
        subtitle: c.subtitle ? String(c.subtitle) : undefined,
        source:
          c.source === "db" || c.source === "external" ? c.source : "external",
        dbCityId: c.dbCityId ? String(c.dbCityId) : undefined,
        meta: c.meta,
      }),
    );
  };

  // Handle selection from autocomplete
  const handleSelect = (label: string, opt?: AutoOption) => {
    // Update visible text in the input
    field.onChange(label);

    const cityOpt = opt as CityAutoOption | undefined;

    if (!cityOpt) {
      // No valid selection → reset both
      setValue("homeBaseCityId", null, { shouldDirty: true });
      setValue("homeBaseLocation", null, { shouldDirty: true });
      return;
    }

    if (cityOpt.source === "db" && cityOpt.dbCityId) {
      // Existing city in DB

      setValue("homeBaseCityId", cityOpt.dbCityId, { shouldDirty: true });
      setValue("homeBaseLocation", null, { shouldDirty: true });
    } else if (cityOpt.source === "external" && cityOpt.meta) {
      // City from external provider – store meta for later creation

      // Store the external metadata that will be used to create the city
      setValue("homeBaseCityId", null, { shouldDirty: true });
      setValue(
        "homeBaseLocation",
        {
          provider: "locationiq",
          placeId:
            cityOpt.meta.placeId ||
            `${cityOpt.meta.name}-${cityOpt.meta.countryCode}`,
          lat: cityOpt.meta.lat,
          lon: cityOpt.meta.lng, // Note: schema expects 'lon', not 'lng'
          city: cityOpt.meta.display_place || cityOpt.meta.name,
          country: cityOpt.meta.address?.country || cityOpt.meta.countryName,
          countryCode:
            cityOpt.meta.address?.country_code || cityOpt.meta.countryCode,
          displayName: cityOpt.meta.display_name,
          boundingBox: cityOpt.meta.boundingbox
            ? (cityOpt.meta.boundingbox.map(Number) as [
                number,
                number,
                number,
                number,
              ])
            : undefined,
        },
        { shouldDirty: true },
      );
    } else {
      // Fallback: unknown state

      setValue("homeBaseCityId", null, { shouldDirty: true });
      setValue("homeBaseLocation", null, { shouldDirty: true });
    }
  };

  return (
    <Autocomplete
      id="homeBase"
      name="homeBase"
      label="Where do you currently live?"
      placeholder="City, Country (New York, USA)"
      enableRemoteOnType={true}
      loadOptions={searchCities}
      value={(field.value as any) ?? ""}
      onQueryChange={field.onChange}
      onSelect={handleSelect}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
      minChars={2}
      clearOnSelect={false}
    />
  );
}

export default memo(HomeBaseSection);
