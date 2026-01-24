"use client";

import { memo, useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import Input from "@/components/atoms/Input";
import { getAge } from "@/domain/shared/utils/age";

// Pre-compute today's date in YYYY-MM-DD for the <input type="date" />
const TODAY_ISO_DATE = new Date().toISOString().split("T")[0];

function BirthdaySectionClient() {
  // used to avoid label mismatch between server and client
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const { control } = useFormContext<{ birthday: string }>();

  const { field, fieldState } = useController<{ birthday: string }>({
    control,
    name: "birthday",
  });

  // safely compute age only if we have a value
  const age = field.value ? getAge(field.value) : null;

  const label = hasHydrated && age ? `Birthday (${age} years old)` : "Birthday";

  return (
    <Input
      type="date"
      id="birthday"
      label={label}
      // max date = today (prevents future dates)
      max={TODAY_ISO_DATE}
      placeholder="mm/dd/yyyy"
      // spread RHF field props (value, onChange, onBlur, name, ref)
      {...field}
      error={fieldState.error?.message}
    />
  );
}

export default memo(BirthdaySectionClient);
