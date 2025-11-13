"use client";

import { memo } from "react";
import { useFormContext, useController } from "react-hook-form";
import { Autocomplete, AutoOption } from "@/app/component/form/Autocomplete";
import { ar } from "zod/locales";

function HomeBaseSection() {
  const { control } = useFormContext();

  // connect this field to RHF
  const { field, fieldState } = useController({
    control,
    name: "homeBase",
  });

  const searchCities = async (q: string, signal: AbortSignal) => {
    const res = await fetch(`/api/cities/search?q=${encodeURIComponent(q)}`, {
      signal,
    });

    console.log("object", res);

    const data = await res.json();

    if (Array.isArray(data)) {
      return data.map((c: AutoOption) => ({
        id: c.id,
        label: c?.name + (c?.country ? `, ${c.country?.name}` : ""),
        subtitle: c.country?.code, // e.g. "TH", "US", "IL"
      }));
    }
    return [];
  };

  return (
    <Autocomplete
      label="Where do you currently live?"
      id="homeBase"
      name="homeBase"
      placeholder="City, Country (New York, USA)"
      loadOptions={searchCities}
      defaultValue={field.value ?? ""} // initial value for uncontrolled mode
      onSelect={(value) => field.onChange(value)} // update RHF on selection
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  );
}

export default memo(HomeBaseSection);
