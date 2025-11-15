"use client";

import { memo } from "react";
import { useFormContext, useController } from "react-hook-form";
import { Autocomplete, AutoOption } from "@/app/component/form/Autocomplete";

function HomeBaseSection() {
  const { control } = useFormContext();

  // connect this field to RHF
  const { field, fieldState } = useController({
    control,
    name: "homeBase",
  });

  // Fetch cities from /api/cities/search
  const searchCities = async (q: string, signal: AbortSignal) => {
    const res = await fetch(`/api/cities/search?q=${encodeURIComponent(q)}`, {
      signal,
    });

    if (!res.ok) {
      console.error("Failed to fetch cities", res.status);
      return [];
    }

    const data = await res.json();

    // data already normalized by the API:
    // { id, cityId, label, subtitle, ... }
    if (Array.isArray(data)) {
      return data.map(
        (c: any): AutoOption => ({
          id: c.id,
          label: c.label, // e.g. "Bangkok, Thailand"
          subtitle: c.subtitle, // e.g. "TH"
        })
      );
    }

    return [];
  };

  return (
    <Autocomplete
      id="homeBase"
      name="homeBase"
      label="Where do you currently live?"
      placeholder="City, Country (New York, USA)"
      loadOptions={searchCities}
      defaultValue={field.value ?? ""} // initial value for uncontrolled mode
      onSelect={(value) => field.onChange(value)} // store the label in RHF for now
      onBlur={field.onBlur}
      error={fieldState.error?.message}
      minChars={2}
    />
  );
}

export default memo(HomeBaseSection);
