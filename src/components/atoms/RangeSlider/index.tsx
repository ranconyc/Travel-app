"use client";

import React, { useId, useCallback } from "react";
import Typography from "@/components/atoms/Typography";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// CVA is used here mainly for container logic if needed in future,
// but critical work is replacing styled-jsx with Tailwind arbitrary variants.
const rangeSliderVariants = cva("flex flex-col gap-2", {
  variants: {
    variant: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface RangeSliderProps extends VariantProps<typeof rangeSliderVariants> {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  label?: string;
  unit?: string;
  step?: number;
  className?: string;
  /** Custom formatter for display values */
  formatValue?: (value: number) => string;
}

/**
 * RangeSlider - Dual-thumb range slider using native HTML inputs
 * Follows atomic design principles with design system tokens
 */
export default function RangeSlider({
  min,
  max,
  value,
  onChange,
  label,
  unit = "",
  step = 1,
  className = "",
  formatValue,
  variant,
}: RangeSliderProps) {
  const id = useId();

  // Format helper
  const format = (val: number) =>
    formatValue ? formatValue(val) : `${val}${unit}`;

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Math.min(Number(e.target.value), value[1] - step);
      onChange([newMin, value[1]]);
    },
    [onChange, value, step],
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Math.max(Number(e.target.value), value[0] + step);
      onChange([value[0], newMax]);
    },
    [onChange, value, step],
  );

  // Calculate track fill percentage
  const minPercent = ((value[0] - min) / (max - min)) * 100;
  const maxPercent = ((value[1] - min) / (max - min)) * 100;

  // Shared thumb styles using Tailwind
  const thumbClasses = cn(
    "absolute w-full pointer-events-none appearance-none bg-transparent h-full",
    // Webkit thumb
    "[&::-webkit-slider-thumb]:pointer-events-auto",
    "[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5",
    "[&::-webkit-slider-thumb]:rounded-full",
    "[&::-webkit-slider-thumb]:bg-surface [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand",
    "[&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:appearance-none",
    "[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform",
    "[&::-webkit-slider-thumb]:hover:scale-110",
    "[&::-webkit-slider-thumb]:active:scale-110 [&::-webkit-slider-thumb]:active:bg-brand",
    // Mozilla thumb
    "[&::-moz-range-thumb]:pointer-events-auto",
    "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5",
    "[&::-moz-range-thumb]:rounded-full",
    "[&::-moz-range-thumb]:bg-surface [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand",
    "[&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:appearance-none",
    "[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-transform",
    "[&::-moz-range-thumb]:hover:scale-110",
    "[&::-moz-range-thumb]:active:scale-110 [&::-moz-range-thumb]:active:bg-brand",
  );

  return (
    <div className={cn(rangeSliderVariants({ variant }), className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Typography as="label" variant="tiny" className="text-txt-sec">
            {label}
          </Typography>
          <Typography variant="tiny" className="text-txt-main font-medium">
            {format(value[0])} – {format(value[1])}
          </Typography>
        </div>
      )}

      <div className="relative h-6 flex items-center">
        {/* Track Background */}
        <div className="absolute w-full h-1.5 bg-surface-secondary rounded-full" />

        {/* Active Track Fill */}
        <div
          className="absolute h-1.5 bg-brand rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min Thumb Input */}
        <input
          id={`${id}-min`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleMinChange}
          className={thumbClasses}
          aria-label={`${label} minimum`}
        />

        {/* Max Thumb Input */}
        <input
          id={`${id}-max`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={handleMaxChange}
          className={thumbClasses}
          aria-label={`${label} maximum`}
        />
      </div>

      {/* Min/Max Labels */}
      <div className="flex justify-between">
        <Typography variant="tiny" className="text-txt-muted">
          {format(min)}
        </Typography>
        <Typography variant="tiny" className="text-txt-muted">
          {format(max)}
        </Typography>
      </div>
    </div>
  );
}
