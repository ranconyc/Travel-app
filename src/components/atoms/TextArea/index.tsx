"use client";

import React, { forwardRef } from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ error, label, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-xs">
        {label && (
          <label className="text-micro font-bold text-txt-sec uppercase tracking-wider px-xs">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full rounded-3xl border-2 p-md transition-all resize-none text-p
            bg-bg-main text-txt-main
            ${
              error
                ? "border-brand-error focus:ring-brand-error/20"
                : "border-stroke focus:border-brand focus:ring-brand/20"
            }
            focus:outline-none focus:ring-2
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-tiny text-brand-error px-xs">{error}</p>}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
