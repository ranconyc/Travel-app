"use client";

import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

const STORAGE_KEY_PREFIX = "profile.v1.user-";

/**
 * Persist full form state to localStorage per user.
 * - Loads draft on mount (after hydration) and calls form.reset(draft).
 * - Saves on any form change via watch.
 * - Exposes clearDraft() to remove the saved state after successful submit.
 */
export function useProfileDraft<TFormValues>(
  methods: UseFormReturn<TFormValues>,
  userId: string
) {
  const { reset, watch } = methods;

  // 1) Load draft AFTER hydration (only if it has meaningful data)
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_PREFIX + userId);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      
      // Ensure homeBase is always a string to prevent type issues
      if (parsed.homeBase && typeof parsed.homeBase !== 'string') {
        parsed.homeBase = String(parsed.homeBase);
      }
      
      const draft = parsed as TFormValues;
      
      // Only reset if draft has actual data (not empty defaults)
      const hasData = Object.values(draft).some(
        value => value !== null && value !== undefined && value !== "" && 
                (!Array.isArray(value) || value.length > 0)
      );
      
      if (hasData) {
        reset(draft); // restore full form: homeBase, languages, etc.
      }
    } catch (e) {
      console.error("Failed to load profile draft", e);
    }
  }, [reset, userId]);

  // 2) Save draft on any form change
  useEffect(() => {
    if (typeof window === "undefined") return;

    const subscription = watch((value) => {
      try {
        window.localStorage.setItem(
          STORAGE_KEY_PREFIX + userId,
          JSON.stringify(value)
        );
      } catch (e) {
        console.error("Failed to save profile draft", e);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, userId]);

  // 3) Clear draft after successful submit
  const clearDraft = () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(STORAGE_KEY_PREFIX + userId);
    } catch (e) {
      console.error("Failed to clear profile draft", e);
    }
  };

  return { clearDraft };
}

