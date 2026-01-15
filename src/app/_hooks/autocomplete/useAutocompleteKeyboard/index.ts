import { useCallback } from "react";
import type React from "react";

type UseAutocompleteKeyboardArgs = {
  open: boolean;
  setOpen: (open: boolean) => void;
  mergedLength: number;
  qVal: string;
  minChars: number;
  openOnFocus: boolean;
  activeIndex: number;
  setActiveIndex: (updater: (prev: number) => number) => void;
  onSelectAtIndex: (index: number) => void;
};

/**
 * Encapsulates keyboard behavior for the autocomplete input:
 * - ArrowUp / ArrowDown → move active index
 * - Enter → commit selection
 * - Escape → close dropdown
 */
export function useAutocompleteKeyboardNavigation({
  open,
  setOpen,
  mergedLength,
  qVal,
  minChars,
  openOnFocus,
  activeIndex,
  setActiveIndex,
  onSelectAtIndex,
}: UseAutocompleteKeyboardArgs) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const trimmed = qVal.trim();

      // If dropdown is closed and user presses arrows → open it if possible
      if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        if ((trimmed.length >= minChars && mergedLength > 0) || openOnFocus) {
          setOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown": {
          if (mergedLength === 0) return;
          e.preventDefault();
          setActiveIndex((prev) =>
            mergedLength === 0 ? -1 : (prev + 1) % mergedLength
          );
          break;
        }
        case "ArrowUp": {
          if (mergedLength === 0) return;
          e.preventDefault();
          setActiveIndex((prev) =>
            mergedLength === 0 ? -1 : (prev - 1 + mergedLength) % mergedLength
          );
          break;
        }
        case "Enter": {
          e.preventDefault();
          if (mergedLength === 0) {
            setOpen(false);
            return;
          }
          if (activeIndex >= 0 && activeIndex < mergedLength) {
            onSelectAtIndex(activeIndex);
          }
          break;
        }
        case "Escape": {
          setOpen(false);
          break;
        }
      }
    },
    [
      open,
      qVal,
      minChars,
      mergedLength,
      openOnFocus,
      activeIndex,
      setOpen,
      setActiveIndex,
      onSelectAtIndex,
    ]
  );

  return handleKeyDown;
}
