"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const progressIndicatorVariants = cva("flex items-center", {
  variants: {
    variant: {
      bar: "gap-3",
      dots: "gap-2",
      "step-pill": "gap-2",
    },
  },
  defaultVariants: {
    variant: "bar",
  },
});

const dotVariants = cva("h-2 w-2 rounded-full transition-colors", {
  variants: {
    active: {
      true: "bg-brand",
      false: "bg-surface",
    },
  },
  defaultVariants: {
    active: false,
  },
});

interface ProgressIndicatorProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressIndicatorVariants> {
  currentStep: number;
  totalSteps: number;
  showLabel?: boolean;
}

/**
 * Reusable progress indicator for multi-step forms
 * Supports bar and dot variants
 */
export default function ProgressIndicator({
  currentStep,
  totalSteps,
  variant = "bar",
  showLabel = false,
  className,
  ...props
}: ProgressIndicatorProps) {
  const percentage = (currentStep / totalSteps) * 100;

  if (variant === "dots") {
    return (
      <div
        className={cn(progressIndicatorVariants({ variant }), className)}
        {...props}
      >
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={dotVariants({ active: index < currentStep })}
          />
        ))}
        {showLabel && (
          <span className="text-xs text-secondary ml-2">
            Step {currentStep + 1} of {totalSteps}
          </span>
        )}
      </div>
    );
  }

  if (variant === "step-pill") {
    return (
      <div className={cn("flex items-center gap-2", className)} {...props}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index === currentStep;
          return (
            <div
              key={index}
              className={cn(
                "rounded-full transition-all duration-300",
                isActive ? "w-8 h-2.5 bg-brand" : "w-2.5 h-2.5 bg-surface",
              )}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(progressIndicatorVariants({ variant }), className)}
      {...props}
    >
      <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
        <div
          className="h-full bg-brand transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-secondary whitespace-nowrap">
          {currentStep + 1}/{totalSteps}
        </span>
      )}
    </div>
  );
}
