import { getUserId, getSession } from "@/lib/auth/get-current-user";
import { z } from "zod";
import { ActionResponse } from "@/types/actions";

/**
 * Higher-order function to create a type-safe and auth-protected Server Action.
 */
export function createSafeAction<TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (data: TInput, userId: string) => Promise<TOutput>,
) {
  return async (rawInput: TInput): Promise<ActionResponse<TOutput>> => {
    try {
      // 1. Authentication
      const userId = await getUserId();
      if (!userId) {
        console.warn("[SafeAction] Unauthorized attempt");
        return { success: false, error: "UNAUTHORIZED" };
      }

      // 2. Validation
      const parsed = schema.safeParse(rawInput);
      if (!parsed.success) {
        const flat = parsed.error.flatten();
        const fieldErrors: Record<string, string> = {};
        for (const [name, messages] of Object.entries(flat.fieldErrors) as [
          string,
          string[] | undefined,
        ][]) {
          if (messages && messages[0]) {
            fieldErrors[name] = messages[0];
          }
        }
        return { success: false, error: "VALIDATION_ERROR", fieldErrors };
      }

      // 3. Execution
      const result = await handler(parsed.data, userId);
      return { success: true, data: result };
    } catch (error) {
      console.error("[SafeAction] Internal Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "INTERNAL_SERVER_ERROR",
      };
    }
  };
}

/**
 * Public action wrapper (no auth required)
 */
export function createPublicAction<TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (data: TInput) => Promise<TOutput>,
) {
  return async (rawInput: TInput): Promise<ActionResponse<TOutput>> => {
    try {
      const parsed = schema.safeParse(rawInput);
      if (!parsed.success) {
        const flat = parsed.error.flatten();
        const fieldErrors: Record<string, string> = {};
        for (const [name, messages] of Object.entries(flat.fieldErrors) as [
          string,
          string[] | undefined,
        ][]) {
          if (messages && messages[0]) {
            fieldErrors[name] = messages[0];
          }
        }
        return { success: false, error: "VALIDATION_ERROR", fieldErrors };
      }

      const result = await handler(parsed.data);
      return { success: true, data: result };
    } catch (error) {
      console.error("[PublicAction] Internal Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "INTERNAL_SERVER_ERROR",
      };
    }
  };
}

/**
 * Admin only action wrapper
 */
export function createAdminAction<TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (data: TInput, userId: string) => Promise<TOutput>,
) {
  return async (rawInput: TInput): Promise<ActionResponse<TOutput>> => {
    try {
      const session = await getSession();
      if (
        !session?.user?.id ||
        (session.user as { role?: string }).role !== "ADMIN"
      ) {
        console.warn("[AdminAction] Unauthorized attempt");
        return { success: false, error: "UNAUTHORIZED_ADMIN_ONLY" };
      }

      const parsed = schema.safeParse(rawInput);
      if (!parsed.success) {
        const flat = parsed.error.flatten();
        const fieldErrors: Record<string, string> = {};
        for (const [name, messages] of Object.entries(flat.fieldErrors) as [
          string,
          string[] | undefined,
        ][]) {
          if (messages && messages[0]) fieldErrors[name] = messages[0];
        }
        return { success: false, error: "VALIDATION_ERROR", fieldErrors };
      }

      const result = await handler(parsed.data, session.user.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("[AdminAction] Internal Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "INTERNAL_SERVER_ERROR",
      };
    }
  };
}
