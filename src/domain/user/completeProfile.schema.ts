import * as z from "zod";
import { GenderEnum } from "./user.schema";

const birthdaySchema = z
  .string()
  .min(1, "Birthday is required")
  .refine((val) => {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return false;
    const now = new Date();
    return d <= now;
  }, "Please enter a valid date in the past");

export const languageFormSchema = z.object({
  code: z.string().min(1, "Language code is required"),
});

export const completeProfileSchema = z.object({
  image: z.string().url().nullable().optional(),
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  birthday: birthdaySchema,
  gender: GenderEnum.or(z.literal("")),
  homeBase: z.string().min(1, "Home base is required"),
  occupation: z.string().min(2, "Occupation is too short"),
  languages: z
    .array(languageFormSchema)
    .min(1, "Please select at least one language"),
});

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;
export type LanguageFormValue = z.infer<typeof languageFormSchema>;
