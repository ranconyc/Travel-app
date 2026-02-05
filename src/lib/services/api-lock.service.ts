/**
 * API Lock Service - Prevents duplicate API calls and rate limiting
 */

interface LockEntry {
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  inProgress: boolean;
  result?: any;
}

class ApiLockService {
  private locks = new Map<string, LockEntry>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly SYNC_TTL = 24 * 60 * 60 * 1000; // 24 hours for sync operations

  /**
   * Check if a lock exists and is still valid
   */
  isLocked(key: string): boolean {
    const lock = this.locks.get(key);
    if (!lock) return false;

    if (Date.now() - lock.timestamp > lock.ttl) {
      this.locks.delete(key);
      return false;
    }

    return lock.inProgress;
  }

  /**
   * Acquire a lock for an operation
   */
  acquireLock(key: string, ttl: number = this.DEFAULT_TTL): boolean {
    if (this.isLocked(key)) {
      return false;
    }

    this.locks.set(key, {
      timestamp: Date.now(),
      ttl,
      inProgress: true
    });

    return true;
  }

  /**
   * Release a lock and optionally store result
   */
  releaseLock(key: string, result?: any): void {
    const lock = this.locks.get(key);
    if (lock) {
      lock.inProgress = false;
      lock.result = result;
    }
  }

  /**
   * Get cached result if available
   */
  getCachedResult(key: string): any | null {
    const lock = this.locks.get(key);
    if (!lock || lock.inProgress) return null;

    if (Date.now() - lock.timestamp > lock.ttl) {
      this.locks.delete(key);
      return null;
    }

    return lock.result || null;
  }

  /**
   * Check if data was recently synced (within TTL)
   */
  wasRecentlySynced(key: string): boolean {
    const lock = this.locks.get(key);
    if (!lock) return false;

    return Date.now() - lock.timestamp < lock.ttl;
  }

  /**
   * Mark as recently synced with long TTL
   */
  markAsSynced(key: string): void {
    this.locks.set(key, {
      timestamp: Date.now(),
      ttl: this.SYNC_TTL,
      inProgress: false
    });
  }

  /**
   * Clean up expired locks
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, lock] of this.locks.entries()) {
      if (now - lock.timestamp > lock.ttl) {
        this.locks.delete(key);
      }
    }
  }

  /**
   * Get lock statistics
   */
  getStats(): { total: number; inProgress: number; cached: number } {
    const total = this.locks.size;
    let inProgress = 0;
    let cached = 0;

    for (const lock of this.locks.values()) {
      if (lock.inProgress) inProgress++;
      else if (lock.result) cached++;
    }

    return { total, inProgress, cached };
  }
}

export const apiLockService = new ApiLockService();

// Auto-cleanup every 10 minutes
setInterval(() => apiLockService.cleanup(), 10 * 60 * 1000);
