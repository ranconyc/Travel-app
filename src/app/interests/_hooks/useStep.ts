"use client";
// STEP HOOK

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function useStep() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const step = Number(searchParams.get("step")) || 1;

  // TODO: if user jusr type /interests, redirect to /interests?step=1
  // if user type /interests?step=2, redirect to /interests?step=1 if step 1 is not completed
  // if user type /interests?step=3, redirect to /interests?step=2 if step 2 is not completed

  const handleContinue = () => {
    if (step < 3) {
      router.push(`${pathname}?step=${step + 1}`, { scroll: false });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      router.push(`${pathname}?step=${step - 1}`, { scroll: false });
    } else {
      router.push("/", { scroll: false });
    }
  };

  // //only on mount
  useEffect(() => {
    const stepFromUrl = Number(searchParams.get("step"));
    if (stepFromUrl && stepFromUrl !== step) {
      router.push(`${pathname}?step=${stepFromUrl}`, { scroll: false });
    }
  }, [searchParams]);

  //on step change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", step.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [step]);

  return { step, handleContinue, handleBack };
}
