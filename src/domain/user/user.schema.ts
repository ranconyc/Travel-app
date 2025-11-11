import * as z from "zod";

export const Gender = z.enum(["male", "female", "non_binary"]);

export const userSchema = z.object({
  image: z.string(),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  hometown: z.string().min(3),
  occupation: z.string().min(3),
  birthday: z.string().min(3),
  description: z.string().min(3),
  languages: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
      nativeName: z.string(),
      flag: z.string(),
      label: z.string().optional(),
    })
  ),
  gender: Gender,
});

export type User = z.infer<typeof userSchema>;
export type Language = z.infer<typeof userSchema>["languages"][number];
export type Gender = z.infer<typeof Gender>;
