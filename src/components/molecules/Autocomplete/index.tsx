"use client";

import React, { useRef, forwardRef } from "react";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import { useAutocomplete } from "./hooks/useAutocomplete";
import { AutocompleteInput } from "@/components/atoms/AutocompleteInput";
import AutocompleteResults from "../AutocompleteResults";
import { useClickOutside } from "@/lib/hooks/ui/useClickOutside";
import { cn } from "@/lib/utils";

export type AutoOption = {
  id: string;
  label: string;
  subtitle?: string;
  emoji?: string;
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
      highlight = true,
      className,
      inputClassName,
      listClassName,
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

    // expose input to parent
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const {
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
    } = useAutocomplete({
      options,
      value,
      defaultValue,
      minChars,
      maxResults,
      cacheResults,
      loadOptions,
      onSelect,
      onQueryChange,
      openOnFocus,
      clearOnSelect,
    });

    // close on click outside
    useClickOutside(containerRef as React.RefObject<HTMLElement>, () => {
      setOpen(false);
    });

    return (
      <div
        ref={containerRef}
        className={cn(
          "flex flex-col gap-sm w-full text-left relative",
          className,
        )}
      >
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-semibold capitalize text-txt-main"
          >
            {label}
          </label>
        )}

        <div
          role="combobox"
          aria-haspopup="listbox"
          aria-owns={`${id}-listbox`}
          aria-controls={`${id}-listbox`}
          aria-expanded={open}
          className="relative"
        >
          <AutocompleteInput
            id={id}
            name={name}
            ref={inputRef}
            placeholder={placeholder}
            autoComplete="off"
            type="text"
            value={qVal}
            onChange={(e) => {
              handleInputChange(e.target.value);
              onChange?.(e);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (openOnFocus && merged.length > 0) setOpen(true);
            }}
            onBlur={onBlur}
            onClear={handleClear}
            showClear={!!qVal}
            error={error}
            className={inputClassName}
            aria-autocomplete="list"
            aria-controls={`${id}-listbox`}
            aria-activedescendant={
              activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
            }
            aria-invalid={!!error || undefined}
            aria-describedby={error ? `${id}-error` : undefined}
          />

          <AutocompleteResults
            open={open}
            loading={loading}
            err={err}
            merged={merged}
            qVal={qVal}
            id={id}
            activeIndex={activeIndex}
            highlight={highlight}
            noResultsText={noResultsText}
            listClassName={listClassName}
            optionClassName={optionClassName}
            onSelect={commitSelection}
            onHover={setActiveIndex}
          />
        </div>

        {selectedOptions && <div className="mt-1">{selectedOptions}</div>}

        <ErrorMessage id={`${id}-error`} error={error} />
      </div>
    );
  },
);
