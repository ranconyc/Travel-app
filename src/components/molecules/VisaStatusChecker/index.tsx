"use client";

import React from "react";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Ban,
  HelpCircle,
} from "lucide-react";
import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";
import { type UserVisaStatus, type VisaStatusColor } from "@/types/visa.types";

interface VisaStatusCheckerProps {
  status: UserVisaStatus;
  countryName: string;
  passportCountry?: string;
  className?: string;
}

const statusConfig: Record<
  VisaStatusColor,
  {
    bg: string;
    border: string;
    text: string;
    icon: React.ElementType;
    iconColor: string;
  }
> = {
  green: {
    bg: "bg-green-50 dark:bg-green-900/30",
    border: "border-green-200 dark:border-green-700",
    text: "text-green-800 dark:text-green-200",
    icon: CheckCircle,
    iconColor: "text-green-600 dark:text-green-400",
  },
  orange: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-300 dark:border-amber-700",
    text: "text-amber-800 dark:text-amber-200",
    icon: AlertCircle,
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-800 dark:text-red-200",
    icon: XCircle,
    iconColor: "text-red-600 dark:text-red-400",
  },
  black: {
    bg: "bg-gray-900 dark:bg-gray-950",
    border: "border-red-600 dark:border-red-500",
    text: "text-white",
    icon: Ban,
    iconColor: "text-red-500",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-200",
    icon: HelpCircle,
    iconColor: "text-blue-600 dark:text-blue-400",
  },
};

export default function VisaStatusChecker({
  status,
  passportCountry,
  className = "",
}: VisaStatusCheckerProps) {
  const config = statusConfig[status.color];
  const Icon = config.icon;

  return (
    <Block
      className={`rounded-2xl border-2 ${config.border} ${config.bg} ${className}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-full ${status.color === "black" ? "bg-red-500/20" : config.bg}`}
          >
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Typography
                variant="h4"
                weight="bold"
                className={`${config.text}`}
              >
                {status.color === "black" && "🚫 "}
                {status.label}
              </Typography>
              {passportCountry && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${status.color === "black" ? "bg-red-500/30 text-white" : "bg-black/10 dark:bg-white/10"} ${config.text}`}
                >
                  {passportCountry} Passport
                </span>
              )}
            </div>
            <Typography
              variant="body-sm"
              className={`mt-1 ${config.text} opacity-90`}
            >
              {status.description}
            </Typography>
          </div>
        </div>
      </div>
    </Block>
  );
}
