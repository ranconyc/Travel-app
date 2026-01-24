// Unified, configurable approach
export interface FormatNumberOptions {
  decimals?: number; // Number of decimal places (default: 1)
  removeTrailingZeros?: boolean; // Remove .0 (default: false)
  fallback?: string; // What to return for invalid input (default: "")
  locale?: string; // For localized formatting (default: "en-US")
  useCompactNotation?: boolean; // Use Intl.NumberFormat compact (default: false)
}

export function formatNumberShort(
  num: number | null | undefined,
  options: FormatNumberOptions = {},
): string {
  const {
    decimals = 1,
    removeTrailingZeros = false,
    fallback = "",
    locale = "en-US",
    useCompactNotation = false,
  } = options;

  // Handle invalid input
  if (num == null || isNaN(num)) return fallback;

  // Option 1: Use modern Intl.NumberFormat (recommended for i18n)
  if (useCompactNotation) {
    return new Intl.NumberFormat(locale, {
      notation: "compact",
      maximumFractionDigits: decimals,
    }).format(num);
  }

  // Option 2: Manual formatting (more control)
  const formatWithSuffix = (
    value: number,
    divisor: number,
    suffix: string,
  ): string => {
    const result = (value / divisor).toFixed(decimals);
    return removeTrailingZeros
      ? result.replace(/\.0+$/, "") + suffix
      : result + suffix;
  };

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (absNum >= 1_000_000_000_000) {
    return sign + formatWithSuffix(absNum, 1_000_000_000_000, "T");
  }
  if (absNum >= 1_000_000_000) {
    return sign + formatWithSuffix(absNum, 1_000_000_000, "B");
  }
  if (absNum >= 1_000_000) {
    return sign + formatWithSuffix(absNum, 1_000_000, "M");
  }
  if (absNum >= 1_000) {
    return sign + formatWithSuffix(absNum, 1_000, "K");
  }

  // For numbers < 1000, optionally add commas
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: decimals,
  }).format(num);
}

// Specialized versions for specific use cases
export function formatPopulation(num: number | null | undefined): string {
  return formatNumberShort(num, {
    decimals: 1,
    removeTrailingZeros: true,
    fallback: "N/A",
  });
}

export function formatFollowers(num: number | null | undefined): string {
  return formatNumberShort(num, {
    decimals: 1,
    removeTrailingZeros: true,
    fallback: "0",
  });
}

export function formatCurrency(num: number | null | undefined): string {
  if (num == null || isNaN(num)) return "$0";

  return (
    "$" +
    formatNumberShort(num, {
      decimals: 1,
      removeTrailingZeros: true,
      fallback: "0",
    })
  );
}

// More precise number formatting with full locale support
export function formatNumberPrecise(
  num: number | null | undefined,
  options: Intl.NumberFormatOptions & { fallback?: string } = {},
): string {
  const { fallback = "", ...intlOptions } = options;

  if (num == null || isNaN(num)) return fallback;

  return new Intl.NumberFormat("en-US", intlOptions).format(num);
}
