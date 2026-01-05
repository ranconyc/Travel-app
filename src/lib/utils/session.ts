/**
 * Session utilities for analytics tracking
 */

const SESSION_KEY = "travel_app_session_id";

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get or create a session ID for analytics tracking
 * Uses localStorage for client-side persistence
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    // Server-side: generate a temporary ID
    return generateSessionId();
  }

  try {
    let sessionId = localStorage.getItem(SESSION_KEY);

    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem(SESSION_KEY, sessionId);
    }

    return sessionId;
  } catch {
    // Fallback if localStorage is not available
    console.warn("localStorage not available, using temporary session ID");
    return generateSessionId();
  }
}

/**
 * Clear the current session ID (useful for testing or logout)
 */
export function clearSessionId(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      console.warn("Failed to clear session ID");
    }
  }
}
