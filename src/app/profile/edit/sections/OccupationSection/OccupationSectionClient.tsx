"use client";

import { memo } from "react";
import { useFormContext, useController } from "react-hook-form";
import { Autocomplete } from "@/app/components/form/Autocomplete";
import { useLazyLoad } from "@/app/components/common/hooks/useLazyLoad";

type FormValues = {
  occupation: string;
};

function OccupationSectionClient() {
  const { control } = useFormContext<FormValues>();

  const { field, fieldState } = useController<FormValues>({
    control,
    name: "occupation",
  });

  // Use lazy loading hook for occupations data
  const { data: occupationsData } = useLazyLoad<string[]>(() =>
    import("@/data/occupations.json").then((module) =>
      module.default.filter(Boolean),
    ),
  );

  // Options are the filtered occupations
  const options = occupationsData || [];

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

export default memo(OccupationSectionClient);
