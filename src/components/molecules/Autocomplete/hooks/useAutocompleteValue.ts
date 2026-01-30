import { useEffect, useState, useRef } from "react";

type UseAutocompleteValueArgs = {
  value?: string;
  defaultValue?: string;
};

type UseAutocompleteValueResult = {
  qVal: string; // effective query value
  isControlled: boolean;
  setInnerValue: (next: string) => void; // update internal state
  reset: () => void; // clear internal value (for clear button)
};

/**
 * Manages controlled vs uncontrolled value for the autocomplete input.
 *
 * Key insight: Even in "controlled" mode, we need to allow the user to type
 * freely. The `inner` state holds the current query text. When the external
 * controlled `value` changes (e.g., after selection), we sync `inner` to it.
 */
export function useAutocompleteValue({
  value,
  defaultValue,
}: UseAutocompleteValueArgs): UseAutocompleteValueResult {
  const isControlled = value !== undefined;

  // Internal state for the query - used for BOTH controlled and uncontrolled
  const [inner, setInner] = useState(value ?? defaultValue ?? "");

  // Track the previous controlled value to detect external changes
  const prevValueRef = useRef(value);

  // Sync internal state when controlled value changes from outside
  // (e.g., after a selection is made or parent resets the value)
  useEffect(() => {
    if (isControlled && value !== prevValueRef.current) {
      setInner(value ?? "");
      prevValueRef.current = value;
    }
  }, [isControlled, value]);

  // The query value is always the internal state (allows typing)
  const qVal = inner;

  const setInnerValue = (next: string) => {
    setInner(next);
  };

  const reset = () => {
    setInner("");
  };

  return { qVal, isControlled, setInnerValue, reset };
}
