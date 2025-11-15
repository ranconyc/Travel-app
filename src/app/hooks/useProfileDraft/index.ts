import { useEffect, useCallback } from "react";
import type { UseFormReturn } from "react-hook-form";

const KEY_PREFIX = "profile.v1.user-";

export function useProfileDraft(form: UseFormReturn<any>, userId: string) {
  const key = KEY_PREFIX + userId;

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return;

      const draft = JSON.parse(raw);
      form.reset(draft);
    } catch (err) {
      console.error("Failed to load draft", err);
    }
  }, [form, key]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(values));
      } catch (err) {
        console.error("Failed to save draft", err);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, key]);

  const clearDraft = useCallback(() => {
    window.localStorage.removeItem(key);
  }, [key]);

  return { clearDraft };
}
