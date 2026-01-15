import { z } from "zod";

export const formSchema = z.object({
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  dailyRhythm: z.string().min(1, "Please select a daily rhythm"),
  travelStyle: z.string().min(1, "Please select a travel style"),
});

export type PersonaFormValues = z.infer<typeof formSchema>;
