import { z } from "zod";

export const travelFormSchema = z.object({
  countries: z.array(z.string()).min(1, "Please select at least one country"),
});

export type TravelFormValues = z.infer<typeof travelFormSchema>;
