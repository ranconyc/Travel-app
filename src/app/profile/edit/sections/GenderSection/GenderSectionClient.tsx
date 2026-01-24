// src/app/(profile)/complete/sections/GenderSection.tsx
"use client";

import { memo } from "react";
import { useController, useFormContext } from "react-hook-form";
import SelectionCard from "@/components/atoms/SelectionCard";
import { Mars, Venus, NonBinary, LucideIcon } from "lucide-react";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import { CompleteProfileFormValues } from "@/domain/user/completeProfile.schema";

// match Prisma enum Gender { MALE, FEMALE, NON_BINARY }
type GenderValue = "MALE" | "FEMALE" | "NON_BINARY";

const OPTIONS: { value: GenderValue; label: string; icon: LucideIcon }[] = [
  { value: "MALE", label: "Male", icon: Mars },
  { value: "FEMALE", label: "Female", icon: Venus },
  { value: "NON_BINARY", label: "Non Binary", icon: NonBinary },
];

function GenderSectionClient() {
  const { control } = useFormContext<CompleteProfileFormValues>();

  const { field, fieldState } = useController<CompleteProfileFormValues>({
    name: "gender",
    control,
    rules: { required: "Please select your gender" },
  });

  return (
    <fieldset className="mb-6">
      <legend className="block mb-3 text-sm font-semibold capitalize text-txt-main">
        How do you identify?
      </legend>

      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <SelectionCard
            key={opt.value}
            label={opt.label}
            type="radio"
            isSelected={field.value === opt.value}
            onChange={() => field.onChange(opt.value)}
          />
        ))}
      </div>

      <ErrorMessage id="gender-error" error={fieldState.error?.message} />
    </fieldset>
  );
}

export default memo(GenderSectionClient);
