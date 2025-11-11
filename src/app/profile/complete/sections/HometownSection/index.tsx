// HometownSection.tsx
"use client";
import { memo } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Autocomplete } from "@/app/component/form/Autocomplete";

function HometownSectionInner() {
  const { control } = useFormContext();

  const { field, fieldState } = useController({
    control,
    name: "hometown",
  });

  return (
    <Autocomplete
      label="Hometown"
      id="hometown"
      name="hometown"
      placeholder="New York, USA"
      value={field.value ?? ""} // controlled
      onQueryChange={field.onChange} // typing updates RHF
      onSelect={(value) => field.onChange(value)} // selecting updates RHF
      onBlur={field.onBlur}
      error={fieldState.error?.message}
      loadOptions={async () => []} // plug in later
    />
  );
}

export default memo(HometownSectionInner);
