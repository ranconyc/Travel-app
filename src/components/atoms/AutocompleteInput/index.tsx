"use client";

import React, { forwardRef } from "react";
import Button from "@/components/atoms/Button";
import { X } from "lucide-react";

interface AutocompleteInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear: () => void;
  showClear: boolean;
  error?: string;
}

export const AutocompleteInput = forwardRef<
  HTMLInputElement,
  AutocompleteInputProps
>(({ onClear, showClear, error, className, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <input
        ref={ref}
        className={[
          "bg-surface text-txt-main px-4 h-12 rounded-[8px] font-medium border-1 border-surface-secondary transition-all w-full shadow-sm placeholder:text-secondary/60",
          "focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand",
          "disabled:bg-surface-secondary disabled:cursor-not-allowed",
          error ? "border-error ring-1 ring-error" : "",
          className,
          showClear ? "pr-10" : "pr-4",
        ].join(" ")}
        {...props}
      />

      {showClear && (
        <Button
          type="button"
          variant="ghost"
          onClick={onClear}
          className="absolute inset-y-0 right-2 flex items-center bg-transparent p-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear input"
        >
          <X size={20} />
        </Button>
      )}
    </div>
  );
});

AutocompleteInput.displayName = "AutocompleteInput";
