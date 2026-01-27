"use client";

import { useFormContext, Controller } from "react-hook-form";
import { PersonaFormValues } from "@/domain/persona/persona.schema";
import { Autocomplete } from "@/components/molecules/Autocomplete";
import { searchCitiesAction } from "@/domain/city/city.search.action";
import Typography from "@/components/atoms/Typography";

export default function HometownStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext<PersonaFormValues>();

  return (
    <div className="flex flex-col gap-xl w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4 pt-4">
        <Controller
          control={control}
          name="hometown"
          render={({ field: { value, onChange } }) => (
            <div className="flex flex-col gap-1">
              <Autocomplete
                label="Home City"
                name="hometown"
                placeholder="Search your city..."
                value={value || ""}
                onQueryChange={onChange}
                loadOptions={async (q) => {
                  const res = await searchCitiesAction({ query: q, limit: 5 });
                  if (!res.success || !res.data) return [];
                  return res.data.map((c) => ({
                    id: c.id,
                    label: c.label,
                    subtitle: c.subtitle || undefined,
                  }));
                }}
                onSelect={(val) => {
                  onChange(val);
                }}
                error={errors.hometown?.message}
              />
              <Typography variant="tiny" color="sec" className="px-xs mt-xs">
                Matches are found based on your location.
              </Typography>
            </div>
          )}
        />
      </div>
    </div>
  );
}
