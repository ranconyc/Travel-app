"use client";

import { usePersonaCompletion } from "@/providers/PersonaProvider";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ProfileCompletionBadgeProps {
  variant?: "compact" | "full";
  onClick?: () => void;
}

/**
 * ProfileCompletionBadge - Visual indicator of profile completion
 *
 * Shows completion percentage with a circular progress bar.
 * Click to navigate to profile completion flow.
 */
export function ProfileCompletionBadge({
  variant = "compact",
  onClick,
}: ProfileCompletionBadgeProps) {
  const { completionPercentage, missingFields, isFullyComplete } =
    usePersonaCompletion();

  if (isFullyComplete) return null;

  if (variant === "compact") {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand/10 hover:bg-brand/20 transition-colors"
      >
        <div className="w-8 h-8">
          <CircularProgressbar
            value={completionPercentage}
            text={`${completionPercentage}%`}
            styles={buildStyles({
              textSize: "32px",
              pathColor: "var(--color-brand)",
              textColor: "var(--color-brand)",
              trailColor: "var(--color-surface)",
            })}
          />
        </div>
        <span className="text-sm font-medium text-brand">Complete Profile</span>
      </button>
    );
  }

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-xl bg-brand/5 border border-brand/20 cursor-pointer hover:bg-brand/10 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16">
          <CircularProgressbar
            value={completionPercentage}
            text={`${completionPercentage}%`}
            styles={buildStyles({
              textSize: "24px",
              pathColor: "var(--color-brand)",
              textColor: "var(--color-brand)",
              trailColor: "var(--color-surface)",
            })}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Complete Your Profile</h3>
          <p className="text-xs text-secondary">
            {missingFields.length}{" "}
            {missingFields.length === 1 ? "field" : "fields"} remaining
          </p>
        </div>
      </div>
      {missingFields.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {missingFields.map((field) => (
            <span
              key={field}
              className="text-xs px-2 py-1 rounded-md bg-surface text-secondary"
            >
              {field}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
