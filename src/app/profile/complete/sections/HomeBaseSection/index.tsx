"use client";

import { memo, useEffect } from "react";
import { useFormContext, useController } from "react-hook-form";
import { Autocomplete, AutoOption } from "@/app/component/form/Autocomplete";

type FormValues = {
  homeBase: string;
};

function HomeBaseSection() {
  const { control } = useFormContext<FormValues>();

  const { field, fieldState } = useController<FormValues>({
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

    if (Array.isArray(data)) {
      return data.map(
        (c: any): AutoOption => ({
          id: c.id,
          label: c.label, // e.g. "Tel Aviv, Israel"
          subtitle: c.subtitle,
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
      value={field.value ?? ""} // always reflect RHF value
      onQueryChange={field.onChange} // typing + selection update RHF
      onBlur={field.onBlur}
      error={fieldState?.error?.message}
      minChars={2}
      clearOnSelect={false}
    />
  );
}

export default memo(HomeBaseSection);
