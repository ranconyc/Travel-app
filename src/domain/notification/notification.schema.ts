import { z } from "zod";

export const GetNotificationsSchema = z.object({
  limit: z.number().optional().default(20),
});

export type GetNotificationsInput = z.infer<typeof GetNotificationsSchema>;

export const NotificationVoidSchema = z.object({});
