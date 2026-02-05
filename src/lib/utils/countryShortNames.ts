/**
 * Utility to get short country names for UI display
 * Maps ISO2 codes to preferred short names (e.g., US -> USA)
 */

export const COUNTRY_SHORT_NAMES: Record<string, string> = {
  US: "USA",
  GB: "UK",
  AE: "UAE",
  KR: "South Korea",
  RU: "Russia",
  VN: "Vietnam",
  TW: "Taiwan",
  IR: "Iran",
  BO: "Bolivia",
  VE: "Venezuela",
};

export function getCountryShortName(
  code: string | null | undefined,
  fullName: string,
): string {
  if (!code) return fullName;
  return COUNTRY_SHORT_NAMES[code.toUpperCase()] || fullName;
}
