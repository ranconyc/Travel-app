"use client";
import { memo, useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Autocomplete } from "@/app/component/form/Autocomplete";
import occupationsData from "@/data/occupations.json";

function OccupationSectionInner() {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ control, name: "occupation" });

  const opts = useMemo(() => (occupationsData as string[]).filter(Boolean), []);

  return (
    <Autocomplete
      label="What do you do?"
      id="occupation"
      name="occupation"
      placeholder="Type your job"
      options={opts}
      defaultValue={field.value ?? ""} // uncontrolled init
      onSelect={(val) => field.onChange(val)}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  );
}

export default memo(OccupationSectionInner);
