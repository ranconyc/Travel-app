"use client";

import { useFormContext } from "react-hook-form";
import { PersonaFormValues } from "@/features/persona/types/form";
import { InterestsSelector } from "@/components/organisms/forms";

/**
 * InterestsStep - Form context wrapper for InterestsSelector
 *
 * This component connects the pure InterestsSelector to React Hook Form.
 * For standalone use without form context, use InterestsSelector directly.
 */
export default function InterestsStep() {
  const { watch, setValue } = useFormContext<PersonaFormValues>();
  const selectedInterests = watch("interests");

  return (
    <InterestsSelector
      value={selectedInterests}
      onChange={(interests) => setValue("interests", interests)}
    />
  );
}
