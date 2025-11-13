"use client";

import { memo } from "react";
import { useController, useFormContext } from "react-hook-form";
import Input from "@/app/component/form/Input"; // same import path as current

function NameSectionInner() {
  const { control } = useFormContext();

  // Connect fields to RHF form state
  const first = useController({ control, name: "firstName" });
  const last = useController({ control, name: "lastName" });

  return (
    <div className="flex gap-2">
      <Input
        className="flex-1"
        type="text"
        label="First Name"
        id="firstName"
        placeholder="Enter your first name"
        {...first.field} // includes value, onChange, onBlur, ref
        error={first.fieldState.error?.message} // display zod validation errors
      />

      <Input
        className="flex-1"
        type="text"
        label="Last Name"
        id="lastName"
        placeholder="Enter your last name"
        {...last.field}
        error={last.fieldState.error?.message}
      />
    </div>
  );
}

export default memo(NameSectionInner);
