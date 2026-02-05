import { z } from "zod";

export const FriendshipTargetSchema = z.object({
  targetUserId: z.string().min(1, "Target User ID is required"),
});

export type FriendshipTargetInput = z.infer<typeof FriendshipTargetSchema>;
