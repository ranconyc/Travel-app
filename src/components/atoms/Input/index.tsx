"use client";

import React, { forwardRef, useId } from "react";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "w-full bg-surface text-txt-main font-medium transition-all shadow-sm h-12 rounded-[8px] border-1 placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand disabled:bg-surface-secondary disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "border-surface-secondary",
        error: "border-error ring-1 ring-error",
      },
      // We could add size variants here if needed in future
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    error?: string;
    hintId?: string;
    hintText?: string;
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
    variant,
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
          aria-invalid={Boolean(error) || variant === "error"}
          aria-describedby={describedBy}
          className={cn(
            inputVariants({
              variant: variant ?? (error ? "error" : "default"),
            }),
            leftIcon ? "pl-11" : "pl-4",
            rightIcon ? "pr-11" : "pr-4",
            className,
          )}
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
