import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Setup slow query logging for alpha launch
// Import and setup logging after prisma is initialized
if (typeof process !== "undefined" && process.env.ENABLE_SLOW_QUERY_LOGGING !== "false") {
  // Use dynamic import to avoid circular dependencies
  import("./prisma.with-logging")
    .then((module) => {
      module.setupPrismaLogging(prisma);
      if (process.env.NODE_ENV === "development") {
        console.log("[Prisma] Slow query logging enabled (>500ms)");
      }
    })
    .catch((err) => {
      // Silently fail if logging module has issues
      if (process.env.NODE_ENV === "development") {
        console.warn("[Prisma] Failed to setup slow query logging:", err);
      }
    });
}

export default prisma;
