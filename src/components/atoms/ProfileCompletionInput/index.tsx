"use client";

import React, { forwardRef } from "react";
import Button from "@/components/atoms/Button";
import { X, Check } from "lucide-react";

interface ProfileCompletionInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear: () => void;
  showClear: boolean;
  error?: string;
  completed?: boolean;
  completionPercentage?: number;
  showProgress?: boolean;
}

export const ProfileCompletionInput = forwardRef<
  HTMLInputElement,
  ProfileCompletionInputProps
>(({ 
  onClear, 
  showClear, 
  error, 
  completed = false, 
  completionPercentage = 0, 
  showProgress = true,
  className, 
  ...props 
}, ref) => {
  const getBorderColor = () => {
    if (error) return "border-red-500 ring-1 ring-red-500";
    if (completed) return "border-green-500 ring-1 ring-green-500";
    return "border-surface";
  };

  const getPaddingRight = () => {
    if (showClear) return "pr-10";
    if (completed) return "pr-10";
    return "pr-4";
  };

  return (
    <div className="relative w-full">
      <input
        ref={ref}
        className={[
          "bg-surface text-txt-main px-4 h-11 rounded-md font-medium border-2 transition-all w-full",
          "focus:outline-none focus:ring-2 focus:ring-brand/50",
          "disabled:bg-surface-secondary disabled:cursor-not-allowed",
          getBorderColor(),
          getPaddingRight(),
          className,
        ].join(" ")}
        {...props}
      />

      {/* Completion indicator */}
      {completed && (
        <div className="absolute inset-y-0 right-2 flex items-center">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <Check size={12} className="text-white" />
          </div>
        </div>
      )}

      {/* Progress bar */}
      {showProgress && completionPercentage > 0 && !completed && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-secondary rounded-b-md overflow-hidden">
          <div 
            className="h-full bg-brand transition-all duration-300 ease-out"
            style={{ width: `${Math.min(completionPercentage, 100)}%` }}
          />
        </div>
      )}

      {/* Clear button */}
      {showClear && !completed && (
        <Button
          type="button"
          variant="ghost"
          onClick={onClear}
          className="absolute inset-y-0 right-2 flex items-center bg-transparent p-0 text-txt-sec hover:text-txt-main transition-colors"
          aria-label="Clear input"
        >
          <X size={20} />
        </Button>
      )}
    </div>
  );
});

ProfileCompletionInput.displayName = "ProfileCompletionInput";
