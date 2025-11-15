// src/app/(profile)/complete/sections/GenderSection.tsx
"use client";

import { memo } from "react";
import { useController, useFormContext } from "react-hook-form";
import ErrorMessage from "@/app/component/form/ErrorMessage";
import { CompleteProfileFormValues } from "@/lib/db/user";

// match Prisma enum Gender { MALE, FEMALE, NON_BINARY }
type GenderValue = "MALE" | "FEMALE" | "NON_BINARY";

const OPTIONS: { value: GenderValue; label: string }[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "NON_BINARY", label: "Non Binary" },
];

function GenderSectionInner() {
  const { control } = useFormContext<CompleteProfileFormValues>();

  const { field, fieldState } = useController<CompleteProfileFormValues>({
    name: "gender",
    control,
    rules: { required: "Please select your gender" },
  });

  return (
    <fieldset className="mb-4">
      <legend className="block mb-2 text-sm font-semibold">
        How do you identify?
      </legend>

      <div className="flex items-center justify-between gap-2">
        {OPTIONS.map((opt) => {
          const checked = field.value === opt.value;

          return (
            <label
              key={opt.value}
              className={[
                "flex flex-1 items-center gap-2 rounded-xl border px-4 py-2 cursor-pointer select-none",
                checked
                  ? "border-cyan-700 bg-cyan-50"
                  : "border-gray-300 hover:border-gray-400",
              ].join(" ")}
            >
              {/* Native radio (accessible) */}
              <input
                type="radio"
                className="sr-only"
                name={field.name}
                value={opt.value}
                checked={checked}
                onChange={() => field.onChange(opt.value)}
                onBlur={field.onBlur}
              />

              {/* Custom radio UI */}
              <span
                aria-hidden
                className={[
                  "grid place-items-center h-5 w-5 rounded-full border",
                  checked ? "border-cyan-700" : "border-gray-400",
                ].join(" ")}
              >
                <span
                  className={[
                    "h-2.5 w-2.5 rounded-full",
                    checked ? "bg-cyan-700" : "bg-transparent",
                  ].join(" ")}
                />
              </span>

              <span className="text-base">{opt.label}</span>
            </label>
          );
        })}
      </div>

      <ErrorMessage id="gender-error" error={fieldState.error?.message} />
    </fieldset>
  );
}

export default memo(GenderSectionInner);
