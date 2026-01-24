"use client";
// STEP HOOK

import { useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function useStep(totalSteps: number = 6) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Ensure step is within valid range
  const step = Math.min(
    Math.max(Number(searchParams.get("step")) || 1, 1),
    totalSteps,
  );

  const setStep = useCallback(
    (newStep: number) => {
      const validStep = Math.min(Math.max(newStep, 1), totalSteps);
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", validStep.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams, totalSteps],
  );

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push("/", { scroll: false });
    }
  };

  // Sync step with URL on mount if missing
  useEffect(() => {
    if (!searchParams.has("step")) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", "1");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [pathname, router, searchParams]);

  return { step, handleContinue, handleBack, setStep };
}
