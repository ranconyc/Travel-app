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
  { label, error, className, id, name, hintId, hintText, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const localHintId = hintText ? `${inputId}-hint` : undefined;

  const describedBy =
    [hintId ?? localHintId, error ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const inputEl = (
    <input
      id={inputId}
      name={name}
      ref={ref}
      aria-invalid={Boolean(error) || undefined}
      aria-describedby={describedBy}
      className={` ${className || ""} ${error ? "border-red-500" : ""}`}
      {...rest}
    />
  );

  if (!label) {
    return (
      <div>
        {inputEl}
        {hintText && !error && (
          <p id={localHintId} className="text-sm text-gray-500 -mt-1 mb-2">
            {hintText}
          </p>
        )}
        <ErrorMessage id={errorId} error={error} />
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      {inputEl}
      {hintText && !error && (
        <p id={localHintId} className="text-sm text-gray-500 -mt-1 mb-2">
          {hintText}
        </p>
      )}
      <ErrorMessage id={errorId} error={error} />
    </div>
  );
});

Input.displayName = "Input";
export default Input;
