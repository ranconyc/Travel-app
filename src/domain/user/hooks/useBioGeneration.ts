"use client";

import { useState, useCallback } from "react";
import { generateBio } from "@/domain/user/user.actions";
import { BioInput } from "@/domain/user/user.schema";

export interface BioOption {
  id: string;
  label: string;
  text: string;
}

/**
 * useBioGeneration - Orchestrates AI bio generation.
 * Decouples generation logic, loading states, and error management from the UI.
 */
export function useBioGeneration() {
  const [suggestions, setSuggestions] = useState<BioOption[] | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>("");

  const generate = useCallback(async (formData: BioInput) => {
    setIsPending(true);
    setError("");
    setSuggestions(null);

    try {
      const res = await generateBio({
        firstName: formData.firstName,
        occupation: formData.occupation,
        hometown: formData.hometown,
        birthday: formData.birthday,
        languages: formData.languages,
        gender: formData.gender,
      });

      if (!res.success) {
        setError(
          res.error || "Something went wrong while generating suggestions.",
        );
        return null;
      }

      setSuggestions(res.data.options);
      return res.data.options;
    } catch (err) {
      console.error("[useBioGeneration] Unexpected error:", err);
      setError("An unexpected error occurred.");
      return null;
    } finally {
      setIsPending(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions(null);
    setError("");
  }, []);

  return {
    suggestions,
    isPending,
    error,
    generate,
    clearSuggestions,
  };
}
