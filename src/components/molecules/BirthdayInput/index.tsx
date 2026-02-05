"use client";

import React, { useRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import Input from "@/components/atoms/Input";
import ErrorMessage from "@/components/atoms/ErrorMessage";

interface BirthdayInputProps {
  monthRegistration: UseFormRegisterReturn;
  dayRegistration: UseFormRegisterReturn;
  yearRegistration: UseFormRegisterReturn;
  error?: string;
  className?: string;
}

export default function BirthdayInput({
  monthRegistration,
  dayRegistration,
  yearRegistration,
  error,
  className = "",
}: BirthdayInputProps) {
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (
    part: "month" | "day" | "year",
    val: string,
    nextRef?: React.RefObject<HTMLInputElement | null>,
  ) => {
    if (val && !/^\d*$/.test(val)) return;

    // Auto-advance logic
    if (part !== "year" && val.length === 2 && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  // Helper to pad single digits on blur
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    registration: UseFormRegisterReturn,
  ) => {
    // Call RHF's onBlur first
    registration.onBlur(e);

    const val = e.target.value;
    if (val.length === 1) {
      const padded = "0" + val;
      e.target.value = padded;
      // Trigger RHF update manually since we changed the value
      registration.onChange({
        target: {
          value: padded,
          name: registration.name,
        },
        type: "change",
      });
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor="birthday-month"
        className="text-sm font-semibold capitalize text-txt-main"
      >
        When were you born?
      </label>
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            id="birthday-month"
            aria-label="Month"
            {...monthRegistration}
            onChange={(e) => {
              monthRegistration.onChange(e);
              handleDateChange("month", e.target.value, dayRef);
            }}
            onBlur={(e) => handleBlur(e, monthRegistration)}
            ref={(e: HTMLInputElement | null) => {
              monthRegistration.ref(e);
              if (monthRef)
                (
                  monthRef as React.MutableRefObject<HTMLInputElement | null>
                ).current = e;
            }}
            placeholder="MM"
            variant={error ? "error" : "default"}
            maxLength={2}
            className="text-center"
          />
        </div>
        <div className="flex-1">
          <Input
            id="birthday-day"
            aria-label="Day"
            {...dayRegistration}
            onChange={(e) => {
              dayRegistration.onChange(e);
              handleDateChange("day", e.target.value, yearRef);
            }}
            onBlur={(e) => handleBlur(e, dayRegistration)}
            ref={(e: HTMLInputElement | null) => {
              dayRegistration.ref(e);
              if (dayRef)
                (
                  dayRef as React.MutableRefObject<HTMLInputElement | null>
                ).current = e;
            }}
            placeholder="DD"
            variant={error ? "error" : "default"}
            maxLength={2}
            className="text-center"
          />
        </div>
        <div className="flex-2">
          <Input
            id="birthday-year"
            aria-label="Year"
            {...yearRegistration}
            onChange={(e) => {
              yearRegistration.onChange(e);
              handleDateChange("year", e.target.value);
            }}
            ref={(e: HTMLInputElement | null) => {
              yearRegistration.ref(e);
              if (yearRef)
                (
                  yearRef as React.MutableRefObject<HTMLInputElement | null>
                ).current = e;
            }}
            placeholder="YYYY"
            variant={error ? "error" : "default"}
            maxLength={4}
            className="text-center"
          />
        </div>
      </div>
      {error && <ErrorMessage id="birthday-error" error={error} />}
    </div>
  );
}
