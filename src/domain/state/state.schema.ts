import { z } from "zod";

export const StateSchema = z.object({
  id: z.string().optional(), // MongoDB ObjectId
  stateId: z.number().optional().nullable(),
  name: z.string(),
  native: z.string().optional().nullable(),
  code: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  countryRefId: z.string(),
  coords: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
    })
    .optional()
    .nullable(),
  translations: z.any().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type State = z.infer<typeof StateSchema>;
