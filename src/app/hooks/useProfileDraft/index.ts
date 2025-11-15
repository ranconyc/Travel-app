"use client";

import { useEffect } from "react";
import type { UseFormReturn, FieldValues } from "react-hook-form";
import useStorageState from "@/app/hooks/useStorageState";

// generic so it works with any form type
export function useProfileDraft<TFormValues extends FieldValues>(
  form: UseFormReturn<TFormValues>,
  userId: string
) {
  const storageKey = `profile.v1.user-${userId}`;

  // localStorage state: we store a *partial* form value
  const [draft, setDraft, clearDraft] =
    useStorageState<Partial<TFormValues> | null>(storageKey, null);

  // 1) Load draft AFTER hydration / when it exists
  useEffect(() => {
    if (!draft) return; // nothing to load

    // merge current values with draft from localStorage
    const current = form.getValues();
    form.reset({ ...current, ...draft });
  }, [draft, form]);

  // 2) Save form to draft automatically on every change
  useEffect(() => {
    const subscription = form.watch((values) => {
      // save partial values into localStorage
      setDraft(values as Partial<TFormValues>);
    });

    return () => subscription.unsubscribe();
  }, [form, setDraft]);

  return { clearDraft };
}
