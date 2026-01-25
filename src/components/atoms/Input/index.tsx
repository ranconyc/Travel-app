"use client";

import React, { forwardRef, useId } from "react";
import ErrorMessage from "@/components/atoms/ErrorMessage";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hintId?: string;
  hintText?: string;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    className = "",
    id,
    name,
    hintId,
    hintText,
    leftIcon,
    rightIcon,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;

  const errorId = `${inputId}-error`;
  const localHintId = hintText ? `${inputId}-hint` : undefined;

  // Merge hint + error IDs for aria-describedby
  const describedBy =
    [hintId ?? localHintId, error ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="flex flex-col gap-2 w-full text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold capitalize text-txt-main"
        >
          {label}
        </label>
      )}

      <div className="relative group w-full">
        {leftIcon && (
          <div className="absolute inset-y-0 left-md flex items-center pointer-events-none z-10 text-secondary group-focus-within:text-brand transition-colors">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          ref={ref}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={[
            "w-full bg-surface text-txt-main font-medium transition-all shadow-sm",
            "h-12 rounded-xl border border-border", // Updated sizing/border
            "placeholder:text-secondary/60",
            "focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand",
            "disabled:bg-surface-secondary disabled:cursor-not-allowed",
            error ? "border-red-500 ring-1 ring-red-500" : "border-border",
            leftIcon ? "pl-11" : "px-4", // Adjust padding for icon
            rightIcon ? "pr-11" : "px-4",
            className,
          ].join(" ")}
          {...rest}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-md flex items-center pointer-events-none z-10 text-secondary">
            {rightIcon}
          </div>
        )}
      </div>

      {/* HINT BELOW INPUT (only if no error) */}
      {hintText && !error && (
        <p id={localHintId} className="text-xs text-secondary px-1">
          {hintText}
        </p>
      )}

      {/* ERROR BELOW INPUT */}
      <ErrorMessage id={errorId} error={error} />
    </div>
  );
});

Input.displayName = "Input";
export default Input;
