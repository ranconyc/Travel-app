"use client";

import React, { forwardRef, useId } from "react";
import ErrorMessage from "@/components/atoms/ErrorMessage";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hintId?: string;
  hintText?: string;
  className?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = "", id, name, hintId, hintText, ...rest },
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

      <input
        id={inputId}
        name={name}
        ref={ref}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        className={[
          "text-txt-main px-4 h-11 rounded-md font-medium border-2 border-surface transition-all",
          "focus:outline-none focus:ring-2 focus:ring-brand/50",
          "disabled:bg-surface-secondary disabled:cursor-not-allowed",
          error ? "border-red-500 ring-1 ring-red-500" : "border-surface",
          className,
        ].join(" ")}
        {...rest}
      />

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
