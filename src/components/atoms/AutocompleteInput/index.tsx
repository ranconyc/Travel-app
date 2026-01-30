"use client";

import React, { forwardRef } from "react";
import Button from "@/components/atoms/Button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

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
        className={cn(
          "input-base",
          error && "input-error",
          showClear ? "pr-10" : "pr-4",
          className,
        )}
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
