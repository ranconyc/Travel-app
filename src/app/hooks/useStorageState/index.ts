"use client";

import { useEffect, useState } from "react";
import { isBrowser } from "@/app/_utils/env";

export default function useStorageState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (!isBrowser()) return initial;

    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  // Sync TO localStorage
  useEffect(() => {
    if (!isBrowser()) return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  function clear() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(key);
  }

  return [value, setValue, clear] as const;
}
