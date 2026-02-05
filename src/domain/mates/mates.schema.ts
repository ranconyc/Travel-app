import { z } from "zod";

export const GetMatesSchema = z.object({
  page: z.number().default(1),
});

export type GetMatesInput = z.infer<typeof GetMatesSchema>;
