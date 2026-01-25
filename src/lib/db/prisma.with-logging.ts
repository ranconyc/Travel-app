// Note: This file is imported by prisma.ts after prisma is initialized
// We receive the prisma instance as a parameter to avoid circular dependencies

/**
 * Slow query threshold in milliseconds
 * Queries taking longer than this will be logged
 */
const SLOW_QUERY_THRESHOLD_MS = 500;

/**
 * Logs slow database queries for monitoring and optimization
 */
function logSlowQuery(
  model: string,
  operation: string,
  duration: number,
  params?: unknown,
) {
  const message = `[Slow Query] ${model}.${operation} took ${duration}ms`;

  console.warn(message, {
    model,
    operation,
    duration,
    threshold: SLOW_QUERY_THRESHOLD_MS,
    params: params
      ? JSON.stringify(params).substring(0, 200)
      : undefined,
    timestamp: new Date().toISOString(),
  });

  // In production, you could send to monitoring service
  // Example: sendToMonitoringService({ type: 'slow_query', ... })
}

/**
 * Setup Prisma middleware for query logging
 * This intercepts all Prisma queries and logs slow ones
 * 
 * Note: Prisma 6 uses $extends instead of $use for middleware
 * This implementation uses $use for compatibility, but may need
 * to be updated to $extends in future Prisma versions
 */
export function setupPrismaLogging(prismaInstance: any) {
  // Check if middleware is already set up
  if ((prismaInstance as any)._loggingSetup) {
    return;
  }

  // Use Prisma middleware (available in Prisma 2.26+)
  // Note: In Prisma 6, $use is deprecated but still works
  // Future: Use $extends with $allOperations
  prismaInstance.$use(async (params: any, next: any) => {
    const startTime = Date.now();

    try {
      const result = await next(params);
      const duration = Date.now() - startTime;

      if (duration > SLOW_QUERY_THRESHOLD_MS) {
        logSlowQuery(
          params.model || "unknown",
          params.action,
          duration,
          params.args,
        );
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      // Log slow queries even if they fail
      if (duration > SLOW_QUERY_THRESHOLD_MS) {
        logSlowQuery(
          params.model || "unknown",
          params.action,
          duration,
          params.args,
        );
      }

      throw error;
    }
  });

  // Mark as set up to prevent duplicate middleware
  (prismaInstance as any)._loggingSetup = true;
  
  if (process.env.NODE_ENV === "development") {
    console.log("[Prisma] Slow query logging middleware installed (>500ms)");
  }
}
