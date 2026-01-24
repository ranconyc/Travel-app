"use client";

import React, { useRef, useState, forwardRef } from "react";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import { highlightMatch } from "@/components/molecules/Autocomplete/highlightMatch";
import { useAutocompleteValue } from "./hooks/useAutocompleteValue";
import { useAutocompleteKeyboardNavigation } from "./hooks/useAutocompleteKeyboard";
import { useClickOutside } from "@/hooks/ui/useClickOutside";
import { useAutocompleteRemote } from "./hooks/useAutocompleteRemote";
import { useAutocompleteOptions } from "./hooks/useAutocompleteOptions";
import Button from "@/components/atoms/Button";
import { X } from "lucide-react";

export type AutoOption = {
  id: string;
  label: string;
  subtitle?: string;
};

export type AutocompleteProps = {
  options?: string[]; // local list support
  id?: string;
  label?: string;
  name: string;
  placeholder?: string;
  error?: string;
  maxResults?: number;
  minChars?: number;
  openOnFocus?: boolean;
  noResultsText?: string;
  enableRemoteOnType?: boolean;
  highlight?: boolean;
  className?: string;
  inputClassName?: string;
  listClassName?: string;
  clearOnSelect?: boolean;
  value?: string;
  defaultValue?: string;
  cacheResults?: boolean;
  selectedOptions?: React.ReactNode;
  loadOptions?: (q: string, signal: AbortSignal) => Promise<AutoOption[]>;
  optionClassName?: (active: boolean) => string;
  onSelect?: (value: string, option?: AutoOption) => void;
  onQueryChange?: (q: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
};

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  function Autocomplete(
    {
      options,
      label,
      id = "autocomplete",
      name,
      error,
      placeholder = "Type to search…",
      maxResults = 4,
      minChars = 0,
      openOnFocus = true,
      noResultsText = "No results found",
      enableRemoteOnType = false,
      highlight = true,
      className = "",
      inputClassName = "",
      listClassName = "",
      clearOnSelect,
      value,
      defaultValue,
      cacheResults = true,
      selectedOptions,
      optionClassName,
      onSelect,
      onQueryChange,
      loadOptions,
      onChange,
      onBlur,
    },
    ref,
  ) {
    // refs
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // expose input to parent
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // 1) value (controlled/uncontrolled) via hook
    const {
      qVal,
      isControlled,
      setInnerValue,
      reset: resetInner,
    } = useAutocompleteValue({ value, defaultValue });

    // 2) dropdown open/active state
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    // 3) remote options via hook
    const [hasTyped, setHasTyped] = useState(false);
    const effectiveLoadOptions = enableRemoteOnType
      ? hasTyped
        ? loadOptions
        : undefined // block remote until user types
      : loadOptions; // old behavior when the prop is false

    const { remote, loading, err, skipNextFetch, resetRemote } =
      useAutocompleteRemote<AutoOption>({
        query: qVal,
        minChars,
        maxResults,
        loadOptions: effectiveLoadOptions,
        cacheResults,
      });

    // 4) local + merged options via hook
    const { merged } = useAutocompleteOptions({
      options,
      qVal,
      minChars,
      maxResults,
      remote,
    });

    // 5) control open/active when results change
    // Using "adjusting state during rendering" pattern to avoid cascading renders
    const [prevMerged, setPrevMerged] = useState(merged);
    const [prevLoading, setPrevLoading] = useState(loading);

    if (merged !== prevMerged || loading !== prevLoading) {
      setPrevMerged(merged);
      setPrevLoading(loading);

      const shouldBeOpen = merged.length > 0 || (!!qVal && loading);
      if (shouldBeOpen !== open) {
        setOpen(shouldBeOpen);
      }

      const nextIndex = merged.length ? 0 : -1;
      if (nextIndex !== activeIndex) {
        setActiveIndex(nextIndex);
      }
    }

    // 6) selection logic
    const commitSelection = (opt: AutoOption) => {
      skipNextFetch();

      if (!isControlled) {
        setInnerValue(clearOnSelect ? "" : opt.label);
      }

      setOpen(false);
      setActiveIndex(-1);

      onSelect?.(opt.label, opt);
      onQueryChange?.(opt.label);
    };

    // 7) query setter used by typing
    const setQ = (val: string) => {
      if (!hasTyped) setHasTyped(true);
      setInnerValue(val);
      onQueryChange?.(val);
    };

    // 8) clear button
    const handleClear = () => {
      resetInner();
      onQueryChange?.("");
      resetRemote();
      setOpen(false);
      setActiveIndex(-1);
    };

    // 9) keyboard behavior via hook
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
        if (opt) {
          commitSelection(opt);
        }
      },
    });

    // 10) close on click outside
    useClickOutside(containerRef as React.RefObject<HTMLElement>, () => {
      setOpen(false);
    });

    return (
      <div
        ref={containerRef}
        className={`flex flex-col gap-2 w-full text-left ${className}`}
      >
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-semibold capitalize text-txt-main"
          >
            {label}
          </label>
        )}

        {/* input + clear button */}
        <div
          className="relative"
          role="combobox"
          aria-haspopup="listbox"
          aria-owns={`${id}-listbox`}
          aria-controls={`${id}-listbox`}
          aria-expanded={open}
        >
          <input
            id={id}
            name={name}
            ref={inputRef}
            placeholder={placeholder}
            autoComplete="off"
            type="text"
            value={qVal}
            onChange={(e) => {
              setQ(e.target.value);
              // optional: forward raw onChange if caller wants it
              onChange?.(e);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (openOnFocus && merged.length > 0) setOpen(true);
            }}
            onBlur={onBlur}
            aria-autocomplete="list"
            aria-controls={`${id}-listbox`}
            aria-activedescendant={
              activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
            }
            aria-invalid={!!error || undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className={[
              "bg-surface text-txt-main px-4 h-11 rounded-md font-medium border-2 border-surface transition-all w-full",
              "focus:outline-none focus:ring-2 focus:ring-brand/50",
              "disabled:bg-surface-secondary disabled:cursor-not-allowed",
              error ? "border-red-500 ring-1 ring-red-500" : "border-surface",
              inputClassName,
              "pr-10", // Space for clear button
            ].join(" ")}
          />

          {qVal && (
            <Button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-2 flex items-center bg-transparent p-0 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear input"
            >
              <X size={16} />
            </Button>
          )}
        </div>

        {selectedOptions && <div className="mt-1">{selectedOptions}</div>}

        {/* dropdown */}
        {open && (
          <div
            ref={listRef}
            id={`${id}-listbox`}
            role="listbox"
            className={`absolute left-0 right-0 z-20 mt-1 max-h-50 overflow-auto rounded-md border border-surface-secondary bg-surface shadow-xl ${listClassName}`}
          >
            {!loading && (
              <div className="px-3 py-2 text-sm text-secondary">Loading…</div>
            )}
            {!loading && err && (
              <div className="px-3 py-2 text-sm text-red-500">{err}</div>
            )}
            {!loading && !err && merged.length === 0 && qVal && (
              <div className="px-3 py-2 text-sm text-secondary">
                {noResultsText}
              </div>
            )}
            {!loading &&
              !err &&
              merged.map((opt, idx) => (
                <div
                  key={opt.id}
                  id={`${id}-option-${idx}`}
                  role="option"
                  aria-selected={idx === activeIndex}
                  onMouseDown={(e) => {
                    e.preventDefault(); // avoid blur before click
                    commitSelection(opt);
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={
                    optionClassName
                      ? optionClassName(idx === activeIndex)
                      : `cursor-pointer px-3 py-2 transition-colors ${
                          idx === activeIndex
                            ? "bg-brand/10 text-brand font-medium"
                            : "hover:bg-surface-secondary text-txt-main"
                        }`
                  }
                >
                  <div>
                    {highlight ? highlightMatch(opt.label, qVal) : opt.label}
                  </div>
                  {opt.subtitle && (
                    <div className="text-xs text-secondary">{opt.subtitle}</div>
                  )}
                </div>
              ))}
          </div>
        )}

        <ErrorMessage id={`${id}-error`} error={error} />
      </div>
    );
  },
);
