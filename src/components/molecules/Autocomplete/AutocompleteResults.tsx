"use client";

import React from "react";
import { highlightMatch } from "./highlightMatch";
import type { AutoOption } from "./index";

interface AutocompleteResultsProps {
  open: boolean;
  loading: boolean;
  err: string | null;
  merged: AutoOption[];
  qVal: string;
  id: string;
  activeIndex: number;
  highlight?: boolean;
  noResultsText?: string;
  listClassName?: string;
  optionClassName?: (active: boolean) => string;
  onSelect: (opt: AutoOption) => void;
  onHover: (idx: number) => void;
}

export function AutocompleteResults({
  open,
  loading,
  err,
  merged,
  qVal,
  id,
  activeIndex,
  highlight = true,
  noResultsText = "No results found",
  listClassName = "",
  optionClassName,
  onSelect,
  onHover,
}: AutocompleteResultsProps) {
  if (!open) return null;

  return (
    <div
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
        <div className="px-3 py-2 text-sm text-secondary">{noResultsText}</div>
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
              onSelect(opt);
            }}
            onMouseEnter={() => onHover(idx)}
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
            <div>{highlight ? highlightMatch(opt.label, qVal) : opt.label}</div>
            {opt.subtitle && (
              <div className="text-xs text-secondary">{opt.subtitle}</div>
            )}
          </div>
        ))}
    </div>
  );
}
