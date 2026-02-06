"use client";

import React from "react";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Ban,
  HelpCircle,
  ExternalLink,
  CircleDot,
  ChevronLeft,
} from "lucide-react";
import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import { cn } from "@/lib/utils/cn";
import { type VisaRequirement, type UserVisaStatus } from "@/types/visa.types";

interface VisaStatusCheckerProps {
  visa: VisaRequirement;
  userStatus?: UserVisaStatus | null;
  passportCountry?: string | null;
  destinationCountryName?: string;
  className?: string;
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  ILS: "₪",
  THB: "฿",
  JPY: "¥",
  CNY: "¥",
};

// Static conversion rates for 2026 demo purposes
const usdConversionRates: Record<string, number> = {
  EUR: 1.1,
  GBP: 1.3,
  THB: 0.028,
  CNY: 0.14,
  ILS: 0.27,
};

const personalStatusConfig = {
  green: {
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-800 dark:text-green-100",
    icon: CheckCircle,
    iconColor: "text-green-600 dark:text-green-400",
    accent: "bg-green-100/50 dark:bg-green-900/30",
    circle: "bg-green-100 dark:bg-green-900/50",
  },
  orange: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-900 dark:text-amber-100",
    icon: AlertCircle,
    iconColor: "text-amber-600 dark:text-amber-400",
    accent: "bg-amber-100/30 dark:bg-amber-900/20",
    circle: "bg-amber-100 dark:bg-amber-900/40",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-900 dark:text-red-100",
    icon: XCircle,
    iconColor: "text-red-600 dark:text-red-400",
    accent: "bg-red-100/50 dark:bg-red-900/30",
    circle: "bg-red-100 dark:bg-red-900/50",
  },
  black: {
    bg: "bg-gray-900 dark:bg-gray-950",
    border: "border-gray-800 dark:border-gray-700",
    text: "text-white",
    icon: Ban,
    iconColor: "text-red-500",
    accent: "bg-white/5 dark:bg-white/5",
    circle: "bg-white/10 dark:bg-white/10",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-900 dark:text-blue-100",
    icon: HelpCircle,
    iconColor: "text-blue-600 dark:text-blue-400",
    accent: "bg-blue-100/50 dark:bg-blue-900/30",
    circle: "bg-blue-100 dark:bg-blue-900/50",
  },
};

const generalStatusColors = {
  success: personalStatusConfig.green,
  warning: personalStatusConfig.orange,
  error: personalStatusConfig.red,
  info: personalStatusConfig.blue,
};

export default function VisaStatusChecker({
  visa,
  userStatus,
  passportCountry,
  destinationCountryName = "Destination",
  className = "",
}: VisaStatusCheckerProps) {
  const config = userStatus
    ? personalStatusConfig[userStatus.color]
    : generalStatusColors[visa.status as keyof typeof generalStatusColors] ||
      personalStatusConfig.blue;

  const Icon = config.icon;

  // Title: Based on userStatus label or visa type
  const displayTitle = userStatus ? userStatus.label : `${visa.type} Required`;

  // Status mapping for colors
  const effectiveColor = userStatus
    ? userStatus.color
    : visa.status === "success"
      ? "green"
      : visa.status === "warning"
        ? "orange"
        : visa.status === "error"
          ? "red"
          : "blue";

  // Button Color Logic to match status icon color
  const buttonVariant =
    effectiveColor === "green"
      ? "success"
      : effectiveColor === "orange"
        ? "warning"
        : effectiveColor === "red"
          ? "error"
          : "primary";

  // Custom overrides for specific status colors not handled by standard variants (e.g. black theme)
  const buttonClassOverride =
    effectiveColor === "black"
      ? "bg-white/10 text-white hover:bg-white/20 border-white/20"
      : "";

  // Price Formatting
  const formatPrice = () => {
    if (!visa.cost) return null;
    const { amount, currency } = visa.cost;
    const symbol = currencySymbols[currency] || currency;

    if (currency === "USD") return `${symbol}${amount}`;

    const rate = usdConversionRates[currency];
    const usdAmount = rate ? Math.round(amount * rate) : null;
    return (
      <span className="flex items-center gap-1">
        {symbol}
        {amount}
        {usdAmount && (
          <span className="text-secondary text-sm font-normal ml-1">
            (~$ {usdAmount} USD)
          </span>
        )}
      </span>
    );
  };

  const renderRequirements = (dark = false) => (
    <div className="flex flex-col gap-6 w-full">
      {/* Entry Fee Row */}
      {visa.cost && (
        <div className="flex items-center justify-between border-b border-border pb-4">
          <Typography
            variant="ui-sm"
            weight="medium"
            className={dark ? "text-white/70" : "text-secondary font-bold"}
          >
            Entry Fee
          </Typography>
          <Typography
            variant="h3"
            weight="bold"
            className={dark ? "text-white" : "text-txt-main"}
          >
            {formatPrice()}
          </Typography>
        </div>
      )}

      {/* Documents Required */}
      {visa.documentsRequired && visa.documentsRequired.length > 0 && (
        <div className="flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <Typography variant="h3" weight="bold" className="text-txt-main">
              Entry requirements ({visa.documentsRequired.length})
            </Typography>
            <ChevronLeft className="w-5 h-5 text-secondary rotate-180" />
          </div>
          <div className="flex flex-col gap-3">
            {visa.documentsRequired.map((doc, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-secondary"
              >
                <CircleDot className="w-2 h-2 fill-current opacity-30" />
                <Typography variant="ui-sm" weight="medium">
                  {doc}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderButton = () =>
    visa.officialLink && (
      <Button
        variant={buttonVariant}
        className={cn(
          "w-full justify-center py-6 rounded-2xl shadow-lg font-bold text-lg",
          buttonClassOverride,
          buttonClassOverride || buttonVariant !== "primary"
            ? "border-transparent"
            : "shadow-brand/10",
        )}
        onClick={() => window.open(visa.officialLink, "_blank")}
      >
        Apply for {visa.type}
        <ExternalLink className="w-5 h-5 ml-2" />
      </Button>
    );

  const renderNotes = () =>
    visa.notes && (
      <div className="flex items-start gap-2 px-1">
        <AlertCircle
          className={`w-5 h-5 ${config.iconColor} mt-0.5 flex-shrink-0`}
        />
        <Typography
          variant="caption-sm"
          className="italic leading-relaxed text-secondary opacity-80"
        >
          {visa.notes}
        </Typography>
      </div>
    );

  // --- FINAL DESIGN: MODERN AIRY (WINNER) ---
  // Soft tinted background for header
  const softBg =
    effectiveColor === "green"
      ? "bg-green-50/50"
      : effectiveColor === "orange"
        ? "bg-amber-50/50"
        : effectiveColor === "red"
          ? "bg-red-50/50"
          : "bg-blue-50/50";

  return (
    <Block
      className={cn(
        "rounded-[40px] border border-border bg-surface flex flex-col items-center selection:bg-brand selection:text-white shadow-soft overflow-hidden",
        className,
      )}
    >
      {/* Tinted Header Section */}
      <div
        className={cn(
          "w-full p-12 flex flex-col items-center text-center gap-6 border-b border-surface-secondary/20",
          softBg,
        )}
      >
        <div
          className={cn(
            "w-20 h-20 rounded-[28px] flex items-center justify-center shadow-sm",
            config.circle,
          )}
        >
          <Icon className={cn("w-11 h-11", config.iconColor)} />
        </div>

        <div className="flex flex-col gap-2">
          <Typography
            variant="h2"
            className="text-txt-main font-black tracking-tight leading-none text-4xl"
          >
            {displayTitle}
          </Typography>
          <Typography
            variant="caption"
            className="text-secondary font-medium italic opacity-70 text-lg"
          >
            {passportCountry
              ? `For ${passportCountry} Passports entering ${destinationCountryName}`
              : `Visa requirements for entering ${destinationCountryName}`}
          </Typography>
        </div>
      </div>

      <div className="w-full p-10 flex flex-col gap-10">
        {/* Horizontal Stats Row */}
        <div className="flex items-center justify-around w-full border-y border-border py-8 bg-surface-secondary/10 rounded-3xl">
          <div className="flex flex-col items-center gap-1">
            <Typography
              variant="caption-sm"
              className="text-secondary opacity-50 uppercase font-bold tracking-widest text-[10px]"
            >
              Max Stay
            </Typography>
            <Typography weight="bold" className="text-txt-main text-2xl">
              {visa.stay || "N/A"}
            </Typography>
          </div>
          <div className="w-px h-12 bg-border opacity-50" />
          <div className="flex flex-col items-center gap-1">
            <Typography
              variant="caption-sm"
              className="text-secondary opacity-50 uppercase font-bold tracking-widest text-[10px]"
            >
              Processing
            </Typography>
            <Typography weight="bold" className="text-txt-main text-2xl">
              {visa.processingTime || "Instant"}
            </Typography>
          </div>
        </div>

        {renderRequirements()}

        <div className="w-full flex flex-col gap-6 pt-2">
          {renderNotes()}
          {renderButton()}
        </div>
      </div>
    </Block>
  );
}
