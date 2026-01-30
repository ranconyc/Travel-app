"use client";

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textAreaVariants = cva(
  "w-full rounded-3xl border-2 p-md transition-all resize-none text-p bg-bg-main text-txt-main focus:outline-none focus:ring-2 disabled:bg-surface-secondary disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "border-stroke focus:border-brand focus:ring-brand/20",
        error: "border-brand-error focus:ring-brand-error/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textAreaVariants> & {
    error?: string;
    label?: string;
  };

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ error, label, className = "", variant, ...props }, ref) => {
    return (
      <div className="w-full space-y-xs">
        {label && (
          <label className="text-micro font-bold text-txt-sec uppercase tracking-wider px-xs">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            textAreaVariants({ variant: error ? "error" : "default" }),
            className,
          )}
          {...props}
        />
        {error && <p className="text-tiny text-brand-error px-xs">{error}</p>}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
