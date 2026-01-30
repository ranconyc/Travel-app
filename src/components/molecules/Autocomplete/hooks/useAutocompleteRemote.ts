// useAutocompleteRemote.ts
import { useEffect, useRef, useState } from "react";

type UseAutocompleteRemoteArgs<T> = {
  query: string;
  minChars?: number;
  maxResults?: number;
  loadOptions?: (q: string, signal: AbortSignal) => Promise<T[]>;
  cacheResults?: boolean;
};

/**
 * Generic hook for remote autocomplete options:
 * - debounced fetch
 * - abort on new query
 * - optional in-memory cache
 * - ability to skip next fetch (on selection)
 */

export function useAutocompleteRemote<T>({
  query,
  minChars = 0,
  maxResults = 4,
  loadOptions,
  cacheResults = true,
}: UseAutocompleteRemoteArgs<T>) {
  const [remote, setRemote] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, T[]>>(new Map());
  const skipNextRef = useRef(false);

  // allow caller to mark that next query change should NOT trigger a fetch
  const skipNextFetch = () => {
    skipNextRef.current = true;
  };

  // allow caller to clear remote + cancel request (e.g. clear button)
  const resetRemote = () => {
    abortRef.current?.abort();
    setRemote([]);
    setLoading(false);
    setErr(null);
  };

  useEffect(() => {
    if (!loadOptions) {
      setRemote([]);
      return;
    }

    // if caller marked "skip next fetch" (e.g. due to selection),
    // we skip once and reset the flag
    if (skipNextRef.current) {
      skipNextRef.current = false;
      return;
    }

    const q = query.trim();
    if (q.length <= minChars) {
      setRemote([]);
      return;
    }

    const key = q.toLowerCase();

    // 1) cache hit
    if (cacheResults) {
      const cached = cacheRef.current.get(key);
      if (cached) {
        setRemote(cached);
        return;
      }
    }

    const handle = setTimeout(async () => {
      // cancel previous request (if any)
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setErr(null);

      try {
        const res = await loadOptions(q, controller.signal);
        const sliced = res.slice(0, maxResults);
        setRemote(sliced);

        if (cacheResults) {
          cacheRef.current.set(key, sliced);
        }
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          setErr(e?.message || "Failed to load");
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(handle);
  }, [query, minChars, maxResults, loadOptions, cacheResults]);

  return {
    remote,
    loading,
    err,
    skipNextFetch,
    resetRemote,
  };
}
