import * as z from "zod";

import { languageSchema } from "./user.schema";

export const GenderEnum = z.enum(["MALE", "FEMALE", "NON_BINARY"]);

// Form version allows also "" (no selection yet)
export const GenderFormValue = GenderEnum.or(z.literal(""));

// Helper: validate that birthday is a valid ISO date in the past
const birthdaySchema = z
  .string()
  .min(1, "Birthday is required")
  .refine((val) => {
    // Basic check: valid date and not in the future
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return false;
    const now = new Date();
    return d <= now;
  }, "Please enter a valid date in the past");

// Main schema for the form values
export const completeProfileSchema = z.object({
  image: z.string().url().nullable().optional(), // can be null/undefined
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string()
    .max(100, "Last name is too long")
    .optional()
    .or(z.literal("").transform(() => undefined)), // allow empty string

  birthday: birthdaySchema, // ISO date string: "YYYY-MM-DD"

  gender: GenderFormValue, // "MALE" | "FEMALE" | "NON_BINARY" | ""

  homeBase: z.string().min(1, "Please choose your home base"), // later will become cityId

  occupation: z
    .string()
    .max(200, "Occupation is too long")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  languages: z.array(languageSchema).min(0),
});

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;
