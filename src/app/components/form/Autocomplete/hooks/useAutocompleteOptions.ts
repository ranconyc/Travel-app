import { useMemo } from "react";
import type { AutoOption } from "@/app/components/form/Autocomplete";

type UseAutocompleteOptionsArgs = {
  options?: string[];
  qVal: string;
  minChars: number;
  maxResults: number;
  remote: AutoOption[];
};

type UseAutocompleteOptionsResult = {
  filteredLocal: AutoOption[];
  merged: AutoOption[];
};

/**
 * Builds local options (from string[]) and merges them with remote options,
 * deduping by label.
 */
export function useAutocompleteOptions({
  options,
  qVal,
  minChars,
  maxResults,
  remote,
}: UseAutocompleteOptionsArgs): UseAutocompleteOptionsResult {
  const filteredLocal = useMemo<AutoOption[]>(() => {
    if (!options) return [];
    const q = qVal.trim().toLowerCase();
    if (q.length <= minChars) return [];

    return options
      .filter((o) => {
        const t = o.toLowerCase();
        return q === t ? false : t.includes(q);
      })
      .slice(0, maxResults)
      .map<AutoOption>((o, i) => ({
        id: `${o}-${i}`,
        label: o,
      }));
  }, [options, qVal, maxResults, minChars]);

  const merged = useMemo<AutoOption[]>(() => {
    const seen = new Set<string>();

    const add = (arr: AutoOption[]) =>
      arr.filter((o) => {
        const k = o.label.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });

    return [...add(filteredLocal), ...add(remote)];
  }, [filteredLocal, remote]);

  return { filteredLocal, merged };
}
