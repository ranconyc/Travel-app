import { toast } from "sonner";

/**
 * Error Handler Utility
 *
 * Centralized error handling for consistent UX and logging
 */

export interface ErrorHandlerOptions {
  /** User-friendly message to display */
  userMessage: string;
  /** Context for logging (e.g., "AvatarUpload", "CitySearch") */
  logContext?: string;
  /** Whether to show toast notification (default: true) */
  showToast?: boolean;
  /** Custom error callback */
  onError?: (error: unknown) => void;
}

/**
 * Handle async errors with consistent logging and user feedback
 *
 * @example
 * ```typescript
 * try {
 *   await uploadFile(file);
 * } catch (error) {
 *   handleAsyncError(error, {
 *     userMessage: "Failed to upload file",
 *     logContext: "FileUpload"
 *   });
 * }
 * ```
 */
export function handleAsyncError(
  error: unknown,
  options: ErrorHandlerOptions,
): void {
  const { userMessage, logContext, showToast = true, onError } = options;

  // Log to console with context
  const prefix = logContext ? `[${logContext}]` : "[Error]";
  console.error(prefix, error);

  // Show user-friendly toast
  if (showToast) {
    toast.error(userMessage);
  }

  // Call custom error handler if provided
  if (onError) {
    onError(error);
  }

  // In production, send to error tracking service
  if (process.env.NODE_ENV === "production") {
    // Placeholder for Sentry integration
    // logToErrorTracking(error, { context: logContext, userMessage });
  }
}

/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("Failed to fetch")
    );
  }
  return false;
}

/**
 * Handle form validation errors
 */
export function handleValidationError(
  error: unknown,
  fieldName?: string,
): void {
  const message = fieldName
    ? `Invalid ${fieldName}: ${getErrorMessage(error)}`
    : `Validation error: ${getErrorMessage(error)}`;

  toast.error(message);
  console.error("[Validation]", error);
}
