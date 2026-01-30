"use client";

import { memo } from "react";
import { useController, useFormContext } from "react-hook-form";
import Input from "@/components/atoms/Input";
import Typography from "@/components/atoms/Typography";
import { getAge } from "@/domain/shared/utils/age";

const TODAY_ISO_DATE = new Date().toISOString().split("T")[0];

function BirthdaySectionClient() {
  const { control } = useFormContext<{ birthday: string }>();

  const { field, fieldState } = useController<{ birthday: string }>({
    control,
    name: "birthday",
  });

  const age = field.value ? getAge(field.value) : null;

  return (
    <div className="space-y-md">
      <div className="flex justify-between items-center px-xs">
        <Typography variant="h4" color="main">
          Birthday
        </Typography>
        {age !== null && (
          <Typography
            variant="tiny"
            color="sec"
            className="font-bold uppercase tracking-widest"
          >
            {age} years old
          </Typography>
        )}
      </div>

      <Input
        type="date"
        id="birthday"
        max={TODAY_ISO_DATE}
        placeholder="mm/dd/yyyy"
        {...field}
        error={fieldState.error?.message}
        className="rounded-3xl border-2 border-stroke bg-bg-main p-md focus:border-brand transition-all"
      />
    </div>
  );
}

export default memo(BirthdaySectionClient);
