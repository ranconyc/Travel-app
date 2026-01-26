/**
 * UI Constants
 *
 * Centralized constants for UI-related values to eliminate magic numbers
 * and ensure consistency across the application.
 */

// Avatar Sizes (in pixels)
export const AVATAR_SIZES = {
  SMALL: 64,
  MEDIUM: 96,
  LARGE: 128,
  XLARGE: 160,
} as const;

// Debounce Delays (in milliseconds)
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  AUTOCOMPLETE: 500,
  AUTOSAVE: 1000,
  FILTER: 500,
} as const;

// Pagination Limits
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  SEARCH_LIMIT: 5,
  MAX_LIMIT: 50,
  CITIES_AUTOCOMPLETE: 5,
} as const;

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  FADE_IN: 500,
} as const;

// Max Widths (Tailwind equivalents in pixels)
export const MAX_WIDTHS = {
  SM: 384, // max-w-sm (24rem)
  MD: 448, // max-w-md (28rem)
  LG: 512, // max-w-lg (32rem)
  XL: 576, // max-w-xl (36rem)
  "2XL": 672, // max-w-2xl (42rem)
} as const;

// File Upload Limits
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ACCEPTED_IMAGE_TYPES: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
} as const;

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 10,
  STICKY: 20,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  TOAST: 100,
} as const;
