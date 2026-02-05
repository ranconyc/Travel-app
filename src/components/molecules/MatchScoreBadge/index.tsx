"use client";

import { memo } from "react";
import {
  getScoreColorClass,
  getScoreLabel,
  MatchScoreResult,
} from "@/domain/discovery/services/matching.service";
import Typography from "@/components/atoms/Typography";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeContainerVariants = cva(
  "flex items-center justify-center border border-white/20 bg-black/30 backdrop-blur-md rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
  {
    variants: {
      size: {
        sm: "px-2 py-1",
        md: "px-3 py-1.5",
        lg: "px-4 py-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const scoreTextRoles = {
  sm: "ui-sm",
  md: "ui",
  lg: "ui-lg",
} as const;

const labelTextRoles = {
  sm: "micro",
  md: "micro",
  lg: "tiny",
} as const;

interface MatchScoreBadgeProps extends VariantProps<
  typeof badgeContainerVariants
> {
  score: number;
  showLabel?: boolean;
  showBreakdown?: boolean;
  matchResult?: MatchScoreResult;
  className?: string;
}

const MatchScoreBadge = memo(function MatchScoreBadge({
  score,
  size = "md",
  showLabel = true,
  showBreakdown = false,
  matchResult,
  className = "",
}: MatchScoreBadgeProps) {
  const colorClass = getScoreColorClass(score);
  const label = getScoreLabel(score);

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {/* Main Badge - Following MateCard visual language */}
      <div className={badgeContainerVariants({ size })}>
        <div className="flex flex-col items-center justify-center gap-0">
          {/* Score Display */}
          <Typography
            variant={scoreTextRoles[size || "md"]}
            weight="bold"
            color="inverse"
            className="leading-none"
          >
            {score}%
          </Typography>

          {/* Label */}
          {showLabel && (
            <Typography
              variant={labelTextRoles[size || "md"]}
              weight="medium"
              className="text-white/80 leading-tight"
            >
              {label}
            </Typography>
          )}
        </div>
      </div>

      {/* Color Indicator Dot */}
      <div
        className={cn(
          "w-2 h-2 rounded-full shadow-sm",
          colorClass.replace("text-", "bg-"),
        )}
        title={`Match Score: ${label} (${score}%)`}
      />

      {/* Breakdown Tooltip */}
      {showBreakdown && matchResult && (
        <div className="hidden group-hover:block absolute z-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 min-w-48">
          <div className="space-y-2">
            <div className="font-semibold text-sm border-b pb-1">
              Match Breakdown
            </div>

            <div className="flex justify-between text-xs">
              <span>Interests (50%):</span>
              <span
                className={
                  matchResult.breakdown.interests >= 70
                    ? "text-green-600"
                    : "text-gray-600"
                }
              >
                {matchResult.breakdown.interests}%
              </span>
            </div>

            <div className="flex justify-between text-xs">
              <span>Budget (25%):</span>
              <span
                className={
                  matchResult.breakdown.budget >= 70
                    ? "text-green-600"
                    : "text-gray-600"
                }
              >
                {matchResult.breakdown.budget}%
              </span>
            </div>

            <div className="flex justify-between text-xs">
              <span>Vibe (25%):</span>
              <span
                className={
                  matchResult.breakdown.vibe >= 70
                    ? "text-green-600"
                    : "text-gray-600"
                }
              >
                {matchResult.breakdown.vibe}%
              </span>
            </div>

            {matchResult.reasoning.length > 0 && (
              <div className="mt-2 pt-2 border-t text-xs text-gray-600 dark:text-gray-400">
                {matchResult.reasoning.slice(0, 2).map((reason, index) => (
                  <div key={index} className="truncate">
                    • {reason}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

MatchScoreBadge.displayName = "MatchScoreBadge";

export default MatchScoreBadge;
