"use client";

import { memo, useMemo } from "react";
import { useFormContext, useController } from "react-hook-form";
import occupationsData from "@/data/occupations.json";
import { Autocomplete } from "@/app/component/form/Autocomplete";

type FormValues = {
  occupation: string;
};

function OccupationSection() {
  const { control } = useFormContext<FormValues>();

  const { field, fieldState } = useController<FormValues>({
    control,
    name: "occupation",
  });

  // Local options from JSON
  const options = useMemo(
    () => (occupationsData as string[]).filter(Boolean),
    []
  );

  return (
    <Autocomplete
      id="occupation"
      name="occupation"
      label="What do you do?"
      placeholder="Type your job"
      options={options}
      value={field.value ?? ""}
      onQueryChange={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
      clearOnSelect={false}
      openOnFocus
    />
  );
}

export default memo(OccupationSection);
