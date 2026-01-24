"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type AuthView = "landing" | "login" | "signup";

export default function useAuthView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const view = (searchParams.get("view") as AuthView) || "landing";

  const setView = useCallback(
    (newView: AuthView) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newView === "landing") {
        params.delete("view");
      } else {
        params.set("view", newView);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return { view, setView };
}
