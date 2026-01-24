"use client";

import { memo } from "react";
import { useController, useFormContext } from "react-hook-form";
import Input from "@/components/atoms/Input";

function FirstNameSectionClient() {
  const { control } = useFormContext();

  const { field, fieldState } = useController({
    name: "firstName",
    control,
    rules: {
      required: "First name is required",
      minLength: { value: 2, message: "At least 2 characters" },
    },
  });

  return (
    <Input
      label="First Name"
      id="firstName"
      placeholder="Enter your first name"
      {...field}
      error={fieldState.error?.message}
    />
  );
}

export default memo(FirstNameSectionClient);
