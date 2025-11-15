"use client";

import React, { useMemo, useCallback } from "react";
import { Autocomplete } from "@/app/component/form/Autocomplete";

type MultiSelectAutocompleteProps<T> = {
  label?: string;
  name: string;
  placeholder?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
  listClassName?: string;

  // All available items to choose from
  items: T[];

  // Currently selected items
  selected: T[];

  // Called when selection changes (add/remove)
  onChange: (nextSelected: T[]) => void;

  // How to display an item in the autocomplete input/list
  getLabel: (item: T) => string;

  // Unique identifier for an item (e.g. language code)
  getValue: (item: T) => string;

  // Optional: limit max selected items
  maxSelected?: number;
};

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm bg-gray-200 text-black"
      aria-label={`Remove ${label}`}
    >
      {label}
      <span aria-hidden>✕</span>
    </button>
  );
}

/**
 * Generic multi-select component built on top of the single-value Autocomplete.
 * - Uses `items` as the full set of possible choices.
 * - Uses `selected` as the current chosen items.
 * - Emits `onChange(nextSelected)` when items are added/removed.
 */
export function MultiSelectAutocomplete<T>({
  label,
  name,
  placeholder = "Type to search…",
  error,
  className = "",
  inputClassName = "",
  listClassName = "",
  items,
  selected,
  onChange,
  getLabel,
  getValue,
  maxSelected,
}: MultiSelectAutocompleteProps<T>) {
  // Build the list of labels for the base Autocomplete
  const optionLabels = useMemo(
    () => items.map((item) => getLabel(item)),
    [items, getLabel]
  );

  // Helper to check if an item is selected
  const isSelected = useCallback(
    (item: T) => {
      const v = getValue(item);
      return selected.some((s) => getValue(s) === v);
    },
    [selected, getValue]
  );

  // Handle selection from the Autocomplete
  const handleSelect = useCallback(
    (label: string) => {
      // Find item by label
      const item = items.find((it) => getLabel(it) === label);
      if (!item) return;

      const itemValue = getValue(item);
      const alreadySelected = selected.some((s) => getValue(s) === itemValue);

      // If already selected → toggle off (remove)
      if (alreadySelected) {
        const next = selected.filter((s) => getValue(s) !== itemValue);
        onChange(next);
        return;
      }

      // If maxSelected is set and already at limit → do nothing
      if (maxSelected && selected.length >= maxSelected) {
        return;
      }

      // Add new item
      const next = [...selected, item];
      onChange(next);
    },
    [items, selected, onChange, getLabel, getValue, maxSelected]
  );

  const handleRemove = useCallback(
    (item: T) => {
      const value = getValue(item);
      const next = selected.filter((s) => getValue(s) !== value);
      onChange(next);
    },
    [selected, onChange, getValue]
  );

  return (
    <div className={className}>
      <Autocomplete
        label={label}
        id={name}
        name={name}
        options={optionLabels}
        onSelect={handleSelect}
        placeholder={placeholder}
        error={error}
        clearOnSelect
        openOnFocus
        inputClassName={inputClassName}
        listClassName={listClassName}
        /* Selected chips */
        selectedOptions={
          selected.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selected.map((item) => {
                const label = getLabel(item);
                const value = getValue(item);
                return (
                  <Chip
                    key={value}
                    label={label}
                    onRemove={() => handleRemove(item)}
                  />
                );
              })}
            </div>
          )
        }
      />
    </div>
  );
}
