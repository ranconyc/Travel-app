"use client";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  variant?: "bar" | "dots";
  showLabel?: boolean;
}

/**
 * Reusable progress indicator for multi-step forms
 * Supports bar and dot variants
 */
export function ProgressIndicator({
  currentStep,
  totalSteps,
  variant = "bar",
  showLabel = false,
}: ProgressIndicatorProps) {
  const percentage = (currentStep / totalSteps) * 100;

  if (variant === "dots") {
    return (
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-colors ${
              index < currentStep ? "bg-brand" : "bg-surface"
            }`}
          />
        ))}
        {showLabel && (
          <span className="text-xs text-secondary ml-2">
            Step {currentStep} of {totalSteps}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
        <div
          className="h-full bg-brand transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-secondary whitespace-nowrap">
          {currentStep}/{totalSteps}
        </span>
      )}
    </div>
  );
}

export default ProgressIndicator;
