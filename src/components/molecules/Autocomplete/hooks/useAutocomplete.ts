import { useState, useCallback, useEffect } from "react";
import { useAutocompleteValue } from "./useAutocompleteValue";
import { useAutocompleteKeyboardNavigation } from "./useAutocompleteKeyboard";
import { useAutocompleteRemote } from "./useAutocompleteRemote";
import { useAutocompleteOptions } from "./useAutocompleteOptions";
import type { AutoOption } from "../index";

export type UseAutocompleteArgs = {
  options?: string[];
  value?: string;
  defaultValue?: string;
  minChars?: number;
  maxResults?: number;
  cacheResults?: boolean;
  loadOptions?: (q: string, signal: AbortSignal) => Promise<AutoOption[]>;
  onSelect?: (value: string, option?: AutoOption) => void;
  onQueryChange?: (q: string) => void;
  openOnFocus?: boolean;
  clearOnSelect?: boolean;
};

export function useAutocomplete({
  options,
  value,
  defaultValue,
  minChars = 0,
  maxResults = 4,
  cacheResults = true,
  loadOptions,
  onSelect,
  onQueryChange,
  openOnFocus = true,
  clearOnSelect = false,
}: UseAutocompleteArgs) {
  // 1. Manage state for query value (controlled/uncontrolled)
  const {
    qVal,
    isControlled,
    setInnerValue,
    reset: resetValue,
  } = useAutocompleteValue({
    value,
    defaultValue,
  });

  // 2. Manage dropdown visibility and active index
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hasTyped, setHasTyped] = useState(false);

  // State to prevent auto-open immediately after selection
  const [justSelected, setJustSelected] = useState(false);

  // 3. Manage remote data fetching
  const { remote, loading, err, skipNextFetch, resetRemote } =
    useAutocompleteRemote<AutoOption>({
      query: qVal,
      minChars,
      maxResults,
      loadOptions,
      cacheResults,
    });

  // 4. Merge local + remote results
  const { merged } = useAutocompleteOptions({
    options,
    qVal,
    minChars,
    maxResults,
    remote,
  });

  // 5. Auto-manage open/activeIndex based on results (via useEffect to avoid render-time ref access)
  useEffect(() => {
    // Skip auto-open if we just made a selection
    if (justSelected) {
      setJustSelected(false);
      return;
    }

    const shouldBeOpen = merged.length > 0 || (!!qVal && loading);
    if (shouldBeOpen !== open) {
      setOpen(shouldBeOpen);
    }

    const nextIndex = merged.length ? 0 : -1;
    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merged, loading, qVal]);

  // 6. Committing a selection
  const commitSelection = useCallback(
    (opt: AutoOption) => {
      setJustSelected(true); // Prevent auto-open
      skipNextFetch();

      if (!isControlled) {
        setInnerValue(clearOnSelect ? "" : opt.label);
      }

      setOpen(false);
      setActiveIndex(-1);
      resetRemote(); // Clear stale results

      onSelect?.(opt.label, opt);
      onQueryChange?.(opt.label);
    },
    [
      isControlled,
      clearOnSelect,
      setInnerValue,
      skipNextFetch,
      resetRemote,
      onSelect,
      onQueryChange,
    ],
  );

  // 7. Input change handler
  const handleInputChange = useCallback(
    (val: string) => {
      if (!hasTyped) setHasTyped(true);
      setInnerValue(val);
      onQueryChange?.(val);
    },
    [hasTyped, setInnerValue, onQueryChange],
  );

  // 8. Keyboard Navigation
  const handleKeyDown = useAutocompleteKeyboardNavigation({
    open,
    setOpen,
    mergedLength: merged.length,
    qVal,
    minChars,
    openOnFocus,
    activeIndex,
    setActiveIndex,
    onSelectAtIndex: (index) => {
      const opt = merged[index];
      if (opt) commitSelection(opt);
    },
  });

  // 9. Reset / Clear
  const handleClear = useCallback(() => {
    resetValue();
    onQueryChange?.("");
    resetRemote();
    setOpen(false);
    setActiveIndex(-1);
  }, [resetValue, onQueryChange, resetRemote]);

  return {
    qVal,
    open,
    setOpen,
    activeIndex,
    setActiveIndex,
    merged,
    loading,
    err,
    handleInputChange,
    handleKeyDown,
    handleClear,
    commitSelection,
  };
}
