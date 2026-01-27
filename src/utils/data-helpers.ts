/**
 * Shared utility functions for data processing and validation
 */

/**
 * Safely formats timezone strings
 */
export function formatTimezones(timezones: string[] | undefined): string[] {
  if (!Array.isArray(timezones)) return [];
  
  return timezones
    .map((tz: string) => tz?.replace('UTC', '').replace(':00', ''))
    .filter(Boolean);
}

/**
 * Safely gets plug types with fallback
 */
export function getPlugTypes(
  countryPlugs: Record<string, string[]>,
  countryCode?: string,
  fallbackPlugs?: string[]
): string[] {
  if (!countryCode) return fallbackPlugs || ["A", "B"];
  
  const plugs = countryPlugs[countryCode];
  return Array.isArray(plugs) ? plugs : fallbackPlugs || ["A", "B"];
}

/**
 * Safely maps array with null checks
 */
export function safeMap<T, R>(
  array: T[] | undefined | null,
  mapper: (item: T, index: number) => R,
  fallback: R[] = []
): R[] {
  if (!Array.isArray(array)) return fallback;
  
  return array.map(mapper);
}

/**
 * Gets budget data with proper fallback
 */
export function getBudgetData<T>(
  budgetData: Record<string, T>,
  countryCode: string,
  fallback: T
): T {
  return budgetData[countryCode] || fallback;
}

/**
 * Validates and formats phone number
 */
export function formatPhoneNumber(phoneData: {
  root?: string;
  suffixes?: string[];
}): string {
  if (!phoneData?.root) return '+1';
  
  const suffix = phoneData.suffixes?.[0] || '';
  return `+${phoneData.root}${suffix}`;
}

/**
 * Safe string conversion
 */
export function safeString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value.toString();
  return String(value || '');
}

/**
 * Checks if value is a valid non-empty string
 */
export function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Creates a safe key for React lists
 */
export function createSafeKey(base: string, index: number, suffix?: string): string {
  const safeBase = base.replace(/[^a-zA-Z0-9]/g, '_');
  return suffix ? `${safeBase}_${index}_${suffix}` : `${safeBase}_${index}`;
}
