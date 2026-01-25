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

import Typography from "@/components/atoms/Typography";

function GenderSectionClient() {
  const { control } = useFormContext<CompleteProfileFormValues>();

  const { field, fieldState } = useController<CompleteProfileFormValues>({
    name: "gender",
    control,
    rules: { required: "Please select your gender" },
  });

  return (
    <fieldset className="mb-lg">
      <Typography variant="h4" as="legend" className="mb-md">
        How do you identify?
      </Typography>

      <div className="flex gap-sm">
        {OPTIONS.map((opt) => (
          <SelectionCard
            key={opt.value}
            label={opt.label}
            type="radio"
            isSelected={field.value === opt.value}
            onChange={() => field.onChange(opt.value)}
            className="flex-1"
          />
        ))}
      </div>

      <ErrorMessage id="gender-error" error={fieldState.error?.message} />
    </fieldset>
  );
}

export default memo(GenderSectionClient);
