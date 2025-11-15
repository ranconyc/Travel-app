"use client";

import React, { forwardRef, useId } from "react";
import ErrorMessage from "../ErrorMessage";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hintId?: string;
  hintText?: string;
  className?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = "", id, name, hintId, hintText, ...rest },
  ref
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
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-gray-900"
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
          "w-full rounded-lg border p-2 transition-all",
          "focus:outline-none focus:border-cyan-600",
          error ? "border-red-500" : "border-gray-300",
          className,
        ].join(" ")}
        {...rest}
      />

      {/* HINT BELOW INPUT (only if no error) */}
      {hintText && !error && (
        <p id={localHintId} className="text-sm text-gray-500 -mt-1 mb-1">
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
