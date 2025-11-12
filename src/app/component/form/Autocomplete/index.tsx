// Autocomplete.tsx
"use client";
import React, { useEffect, useMemo, useRef, useState, forwardRef } from "react";
import ErrorMessage from "../ErrorMessage";

export type AutoOption = { id: string; label: string; subtitle?: string };

export type AutocompleteProps = {
  options?: string[]; // local list support
  loadOptions?: (q: string, signal: AbortSignal) => Promise<AutoOption[]>; // async source
  id?: string;
  label?: string;
  name: string;
  placeholder?: string;
  error?: string;
  maxResults?: number;
  minChars?: number;
  openOnFocus?: boolean;
  noResultsText?: string;
  highlight?: boolean;
  className?: string;
  inputClassName?: string;
  listClassName?: string;
  optionClassName?: (active: boolean) => string;
  onSelect?: (value: string, option?: AutoOption) => void;
  onQueryChange?: (q: string) => void;
  clearOnSelect: boolean;
  // NEW: allow controlled usage
  value?: string;
  defaultValue?: string;
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
      className = "",
      inputClassName = "",
      listClassName = "",
      optionClassName,
      onSelect,
      onQueryChange,
      loadOptions,
      clearOnSelect,
      value,
      defaultValue,
      onBlur,
    },
    ref
  ) {
    // refs
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // expose input to parent
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // state
    const isControlled = value !== undefined;
    const [query, setQuery] = useState<string>(defaultValue ?? "");

    // keep internal query in sync when controlled
    useEffect(() => {
      if (isControlled) setQuery(value ?? "");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isControlled, value]);

    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    // remote state
    const [remote, setRemote] = useState<AutoOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    // local filtering (map to AutoOption to unify shape)
    const filteredLocal = useMemo<AutoOption[]>(() => {
      if (!options) return [];
      const q = (isControlled ? value ?? "" : query).trim().toLowerCase();
      if (q.length <= (minChars ?? 0)) return [];
      return options
        .filter((o) => {
          const t = o.toLowerCase();
          return q === t ? false : t.includes(q);
        })
        .slice(0, maxResults ?? 4)
        .map<AutoOption>((o, i) => ({ id: `${o}-${i}`, label: o }));
    }, [options, query, value, isControlled, maxResults, minChars]);

    // remote fetch with debounce + abort
    useEffect(() => {
      if (!loadOptions) {
        setRemote([]);
        return;
      }
      const q = (isControlled ? value ?? "" : query).trim();
      if (q.length <= (minChars ?? 0)) {
        setRemote([]);
        return;
      }

      const handle = setTimeout(async () => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setErr(null);
        try {
          const res = await loadOptions(q, controller.signal);
          setRemote(res.slice(0, maxResults ?? 4));
        } catch (e: any) {
          if (e?.name !== "AbortError") {
            setErr(e?.message || "Failed to load");
          }
        } finally {
          setLoading(false);
        }
      }, 250);

      return () => clearTimeout(handle);
    }, [query, value, isControlled, loadOptions, maxResults, minChars]);

    // merge local + remote (dedupe by label)
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

    // control open/active from merged results
    useEffect(() => {
      const q = isControlled ? value ?? "" : query;
      setOpen(merged.length > 0 || (!!q && loading));
      setActiveIndex(merged.length ? 0 : -1);
    }, [merged.length, query, value, isControlled, loading]);

    // selection
    const commitSelection = (opt: AutoOption) => {
      if (!isControlled) setQuery(clearOnSelect ? "" : opt.label);
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.focus();
      onSelect?.(opt.label, opt);
      onQueryChange?.(opt.label); // keep external value in sync, if used
    };

    // controlled query setter + callback
    const setQ = (val: string) => {
      if (!isControlled) setQuery(val);
      onQueryChange?.(val);
    };

    // keyboard handling (use merged)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const q = isControlled ? value ?? "" : query;

      if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        if (
          (q.trim().length >= (minChars ?? 0) && merged.length > 0) ||
          openOnFocus
        ) {
          setOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          if (merged.length === 0) return;
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % merged.length);
          break;
        case "ArrowUp":
          if (merged.length === 0) return;
          e.preventDefault();
          setActiveIndex((prev) => (prev - 1 + merged.length) % merged.length);
          break;
        case "Enter":
          e.preventDefault();
          if (merged.length === 0) {
            setOpen(false);
            return;
          }
          if (activeIndex >= 0) commitSelection(merged[activeIndex]);
          break;
        case "Escape":
          setOpen(false);
          break;
      }
    };

    // click outside to close
    useEffect(() => {
      const onClickAway = (evt: MouseEvent) => {
        const t = evt.target as Node;
        if (!listRef.current?.contains(t) && !inputRef.current?.contains(t)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", onClickAway);
      return () => document.removeEventListener("mousedown", onClickAway);
    }, []);

    // highlight helper
    const renderOption = (text: string) => {
      const q = isControlled ? value ?? "" : query;
      if (!highlight || !q) return text;
      const lower = text.toLowerCase();
      const qq = q.toLowerCase();
      const start = lower.indexOf(qq);
      if (start === -1) return text;
      const end = start + qq.length;
      return (
        <>
          {text.slice(0, start)}
          <mark className="bg-blue-200 rounded px-0.5">
            {text.slice(start, end)}
          </mark>
          {text.slice(end)}
        </>
      );
    };

    const qVal = isControlled ? value ?? "" : query;

    return (
      <div className={`relative ${className}`}>
        {label && (
          <label htmlFor={id} className="block mb-1 font-medium">
            {label}
          </label>
        )}

        <input
          id={id}
          name={name}
          ref={inputRef}
          placeholder={placeholder}
          autoComplete="off"
          type="text"
          value={qVal}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            console.log("onFocus", openOnFocus, merged.length > 0);
            if (openOnFocus && merged.length > 0) setOpen(true);
          }}
          onBlur={onBlur}
          aria-autocomplete="list"
          aria-controls={`${id}-listbox`}
          aria-expanded={open}
          aria-activedescendant={
            activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
          }
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClassName}
        />

        {open && (
          <div
            tabIndex={0}
            onBlur={() => setOpen(false)}
            ref={listRef}
            id={`${id}-listbox`}
            role="listbox"
            className={`absolute left-0 right-0 z-20 mt-1 max-h-56 overflow-auto rounded-md border border-gray-200 bg-white dark:bg-gray-900 shadow-lg ${listClassName}`}
          >
            {loading && (
              <div className="px-3 py-2 text-sm text-gray-500">Loading…</div>
            )}
            {!loading && err && (
              <div className="px-3 py-2 text-sm text-red-600">{err}</div>
            )}
            {!loading && !err && merged.length === 0 && qVal && (
              <div className="px-3 py-2 text-sm text-gray-500">
                {noResultsText}
              </div>
            )}
            {!loading &&
              !err &&
              merged.map((opt, idx) => {
                console.log("object", opt);
                return (
                  <div
                    key={opt.id}
                    id={`${id}-option-${idx}`}
                    role="option"
                    aria-selected={idx === activeIndex}
                    onMouseDown={(e) => {
                      e.preventDefault(); // avoid input blur before click
                      commitSelection(opt);
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={
                      optionClassName
                        ? optionClassName(idx === activeIndex)
                        : `cursor-pointer px-3 py-2 ${
                            idx === activeIndex
                              ? "bg-cyan-900/20"
                              : "hover:bg-gray-100"
                          }`
                    }
                  >
                    <div>{highlight ? renderOption(opt.label) : opt.label}</div>
                    {opt.subtitle && (
                      <div className="text-xs text-gray-500">
                        {opt.subtitle}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
        <ErrorMessage id={`${id}-error`} error={error} />
      </div>
    );
  }
);
