"use client";

import { memo } from "react";
import { useController, useFormContext } from "react-hook-form";
import Input from "@/components/atoms/Input";

function LastNameSectionClient() {
  const { control } = useFormContext();

  const { field, fieldState } = useController({
    name: "lastName",
    control,
    rules: {
      minLength: { value: 2, message: "At least 2 characters" },
    },
  });

  return (
    <div className="mb-lg">
      <Input
        label="Last Name"
        id="lastName"
        placeholder="Enter your last name"
        {...field}
        error={fieldState.error?.message}
      />
    </div>
  );
}

export default memo(LastNameSectionClient);
