import { useEffect, useState } from "react";

type UseAutocompleteValueArgs = {
  value?: string;
  defaultValue?: string;
};

type UseAutocompleteValueResult = {
  qVal: string; // effective query value
  isControlled: boolean;
  setInnerValue: (next: string) => void; // update internal state if uncontrolled
  reset: () => void; // clear internal value (for clear button)
};

/**
 * Manages controlled vs uncontrolled value for the autocomplete input.
 */
export function useAutocompleteValue({
  value,
  defaultValue,
}: UseAutocompleteValueArgs): UseAutocompleteValueResult {
  const isControlled = value !== undefined;

  // internal state only used when uncontrolled
  const [inner, setInner] = useState(defaultValue ?? "");

  // keep internal state in sync when in controlled mode
  useEffect(() => {
    if (isControlled) {
      setInner(value ?? "");
    }
  }, [isControlled, value]);

  // "real" value used by the input
  const qVal = isControlled ? value ?? "" : inner;

  const setInnerValue = (next: string) => {
    if (!isControlled) {
      setInner(next);
    }
  };

  const reset = () => {
    setInnerValue("");
  };

  return { qVal, isControlled, setInnerValue, reset };
}
