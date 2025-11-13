"use client";

import { memo, useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import Input from "@/app/component/form/Input";
import { getAge } from "../../../../_utils/age";

function BirthdaySectionInner() {
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => setHasHydrated(true), []);
  const { control } = useFormContext();

  const { field, fieldState } = useController({
    control,
    name: "birthday",
  });

  const age = getAge(field.value);

  return (
    <Input
      type="date"
      id="birthday"
      placeholder="mm/dd/yyyy"
      label={hasHydrated && age ? `Birthday (${age} years old)` : "Birthday"}
      max={new Date().toISOString().split("T")[0]}
      {...field}
      error={fieldState.error?.message}
    />
  );
}

export default memo(BirthdaySectionInner);
