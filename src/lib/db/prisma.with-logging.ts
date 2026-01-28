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
 * Setup Prisma query extension for logging
 * This uses $extends for Prisma 6+ compatibility instead of deprecated $use
 * 
 * Note: Prisma 6+ uses $extends for query extensions and middleware
 */
export function setupPrismaLogging(prismaInstance: any) {
  // Check if extension is already set up
  if ((prismaInstance as any)._loggingSetup) {
    return;
  }

  // Check if $extends method is available
  if (typeof prismaInstance.$extends !== 'function') {
    console.warn('[Prisma] $extends method not available. Skipping slow query logging.');
    console.warn('[Prisma] This might be due to Prisma version compatibility.');
    return;
  }

  try {
    // Use Prisma query extension (Prisma 6+)
    const prismaWithLogging = prismaInstance.$extends({
      query: {
        async $allOperations({ 
          operation, 
          model, 
          args, 
          query 
        }: { 
          operation: any; 
          model: any; 
          args: any; 
          query: any; 
        }) {
          const startTime = Date.now();

          try {
            const result = await query(args);
            const duration = Date.now() - startTime;

            if (duration > SLOW_QUERY_THRESHOLD_MS) {
              logSlowQuery(
                model || "unknown",
                operation,
                duration,
                args,
              );
            }

            return result;
          } catch (error) {
            const duration = Date.now() - startTime;

            // Log slow queries even if they fail
            if (duration > SLOW_QUERY_THRESHOLD_MS) {
              logSlowQuery(
                model || "unknown",
                operation,
                duration,
                args,
              );
            }

            throw error;
          }
        },
      },
    });

    // Replace the original instance with the extended one
    Object.assign(prismaInstance, prismaWithLogging);

    // Mark as set up to prevent duplicate extensions
    (prismaInstance as any)._loggingSetup = true;
    
    if (process.env.NODE_ENV === "development") {
      console.log("[Prisma] Slow query logging extension installed (>500ms)");
    }
  } catch (error) {
    console.warn('[Prisma] Failed to setup slow query logging:', error);
    console.warn('[Prisma] Continuing without query logging...');
  }
}
