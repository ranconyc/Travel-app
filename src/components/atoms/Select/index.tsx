"use client";

import React, { forwardRef, useId } from "react";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import Typography from "@/components/atoms/Typography";
import { ChevronDown } from "lucide-react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
  options: { value: string; label: string }[];
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    error,
    className = "",
    containerClassName = "",
    id,
    name,
    options,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const errorId = `${selectId}-error`;

  return (
    <div
      className={`flex flex-col gap-2 w-full text-left ${containerClassName}`}
    >
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-semibold capitalize text-txt-main"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          name={name}
          ref={ref}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
          className={[
            "w-full text-txt-main px-4 h-11 rounded-3xl font-medium border-2 bg-surface appearance-none transition-all",
            "focus:outline-none focus:border-brand",
            "disabled:bg-surface-secondary disabled:cursor-not-allowed",
            error ? "border-red-500" : "border-stroke",
            className,
          ].join(" ")}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-txt-sec">
          <ChevronDown size={18} />
        </div>
      </div>

      <ErrorMessage id={errorId} error={error} />
    </div>
  );
});

Select.displayName = "Select";
export default Select;
