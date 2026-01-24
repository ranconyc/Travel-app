"use client";
// STEP HOOK

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function useStep() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Ensure step is within valid range (1-4)
  const step = Math.min(Math.max(Number(searchParams.get("step")) || 1, 1), 4);

  const handleContinue = () => {
    if (step < 4) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", (step + 1).toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", (step - 1).toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
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

  return { step, handleContinue, handleBack };
}
