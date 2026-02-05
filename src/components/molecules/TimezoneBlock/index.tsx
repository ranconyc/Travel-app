"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import Block from "@/components/atoms/Block";
import {
  formatCountryTimezoneMetadata,
  formatTimezoneMetadata,
} from "@/domain/shared/utils/date";
import { cn } from "@/lib/utils";

interface TimezoneBlockProps {
  ianaString?: string; // For Cities
  timezones?: string[]; // For Countries
  capitalTz?: string | null; // For Countries
  className?: string;
}

/**
 * TimezoneBlock - A smart client-side molecule for displaying time.
 * Calculates relative offsets accurately against the user's browser clock.
 */
export default function TimezoneBlock({
  ianaString,
  timezones,
  capitalTz,
  className,
}: TimezoneBlockProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration safety: render a skeleton or empty block on the server
  if (!mounted) {
    return (
      <Block className={cn("animate-pulse min-h-[80px]", className)}>
        <div className="h-4 w-24 bg-secondary/10 rounded mb-2" />
        <div className="h-6 w-32 bg-secondary/20 rounded" />
      </Block>
    );
  }

  // Determine data source
  if (ianaString) {
    const tz = formatTimezoneMetadata(ianaString);
    if (!tz) return null;

    return (
      <Block
        className={cn(
          "bg-surface/60 backdrop-blur-xl border-white/10 transition-all hover:bg-surface/80",
          className,
        )}
      >
        <h3 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-xs flex items-center gap-1.5">
          <Clock size={12} className="text-secondary/60" />
          Timezone
        </h3>
        <div className="flex flex-col">
          <p className="text-p font-black text-txt-main tracking-tight">
            {tz.localTime}
          </p>
          <p className="text-micro text-secondary font-medium tracking-tight">
            {tz.timezoneName} · {tz.relativeContext}
          </p>
        </div>
      </Block>
    );
  }

  if (timezones || capitalTz) {
    const tzData = formatCountryTimezoneMetadata(timezones, capitalTz);

    if (!tzData.localTime && !tzData.rangeLabel) return null;

    return (
      <Block
        className={cn(
          "bg-surface/60 backdrop-blur-xl border-white/10 transition-all hover:bg-surface/80",
          className,
        )}
      >
        <h3 className="text-upheader font-bold text-secondary uppercase tracking-wider mb-xs flex items-center gap-1.5">
          <Clock size={12} className="text-secondary/60" />
          Timezone
        </h3>
        <div className="flex flex-col">
          <p className="text-p font-black text-txt-main tracking-tight">
            {tzData.localTime || tzData.rangeLabel}
          </p>
          <p className="text-micro text-secondary font-medium tracking-tight">
            {tzData.spansTimezones
              ? `Spans ${tzData.count} zones · ${tzData.rangeLabel}`
              : tzData.timezoneName}
            {tzData.relativeContext && ` · ${tzData.relativeContext}`}
          </p>
        </div>
      </Block>
    );
  }

  return null;
}
