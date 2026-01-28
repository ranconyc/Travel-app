"use client";

import { memo } from "react";
import { getScoreColorClass, getScoreLabel, MatchScoreResult } from "@/services/discovery/matching.service";
import Typography from "@/components/atoms/Typography";

interface MatchScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
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

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          container: "px-2 py-1 text-xs",
          score: "text-sm font-bold",
          label: "text-micro"
        };
      case "lg":
        return {
          container: "px-4 py-2 text-sm",
          score: "text-xl font-bold",
          label: "text-sm"
        };
      case "md":
      default:
        return {
          container: "px-3 py-1.5 text-xs",
          score: "text-base font-bold",
          label: "text-micro"
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Main Badge - Following MateCard visual language */}
      <div 
        className={`
          flex items-center justify-center
          border border-white/20 
          bg-black/30 backdrop-blur-md 
          rounded-full shadow-lg
          transition-all duration-300
          hover:scale-105 hover:shadow-xl
          ${sizeClasses.container}
        `}
      >
        <div className="flex flex-col items-center justify-center gap-0">
          {/* Score Display */}
          <Typography
            variant="tiny"
            className={`text-white font-bold leading-none ${sizeClasses.score}`}
          >
            {score}%
          </Typography>
          
          {/* Label */}
          {showLabel && (
            <Typography
              variant="micro"
              className={`text-white/80 font-medium leading-tight ${sizeClasses.label}`}
            >
              {label}
            </Typography>
          )}
        </div>
      </div>

      {/* Color Indicator Dot */}
      <div 
        className={`
          w-2 h-2 rounded-full
          ${colorClass.replace('text-', 'bg-')}
          shadow-sm
        `}
        title={`Match Score: ${label} (${score}%)`}
      />

      {/* Breakdown Tooltip */}
      {showBreakdown && matchResult && (
        <div className="hidden group-hover:block absolute z-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 min-w-48">
          <div className="space-y-2">
            <div className="font-semibold text-sm border-b pb-1">Match Breakdown</div>
            
            <div className="flex justify-between text-xs">
              <span>Interests (50%):</span>
              <span className={matchResult.breakdown.interests >= 70 ? 'text-green-600' : 'text-gray-600'}>
                {matchResult.breakdown.interests}%
              </span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span>Budget (25%):</span>
              <span className={matchResult.breakdown.budget >= 70 ? 'text-green-600' : 'text-gray-600'}>
                {matchResult.breakdown.budget}%
              </span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span>Vibe (25%):</span>
              <span className={matchResult.breakdown.vibe >= 70 ? 'text-green-600' : 'text-gray-600'}>
                {matchResult.breakdown.vibe}%
              </span>
            </div>
            
            {matchResult.reasoning.length > 0 && (
              <div className="mt-2 pt-2 border-t text-xs text-gray-600 dark:text-gray-400">
                {matchResult.reasoning.slice(0, 2).map((reason, index) => (
                  <div key={index} className="truncate">• {reason}</div>
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
