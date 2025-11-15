"use server";

import { z } from "zod";
import { CompleteProfile } from "@/lib/db/user";
import { type User } from "@/domain/user/user.schema";

/*
 * A minimal schema that mirrors the `CompleteProfileFormValues` used on the
 * server.  We coerce the `birthday` from a date or string into a string
 * representation (YYYY‑MM‑DD) and uppercase the gender to match the enum.
 */
const completeProfileSchema = z.object({
  id: z.string(),
  image: z.string().nullable().optional(),
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  birthday: z
    .union([z.string(), z.date()])
    .optional()
    .transform((val) => {
      if (!val) return "";
      if (val instanceof Date) return val.toISOString().split("T")[0];
      return val;
    }),
  gender: z.enum(["MALE", "FEMALE", "NON_BINARY", ""]).optional(),
  homeBase: z.string().optional(),
  occupation: z.string().optional(),
  description: z.string().optional(),
  languages: z.array(z.string()).optional(),
});

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;

/**
 * Server action used by the profile completion form.  It normalises and
 * validates the incoming data and then calls the Prisma update helper.
 */
export async function updateProfile(formData: CompleteProfileInput) {
  try {
    // First parse and normalise the incoming data against our schema.  The
    // transform on `birthday` ensures a date object becomes a string and
    // uppercases `gender` if necessary.  Unknown keys are stripped.
    const parsed = completeProfileSchema.safeParse({
      ...formData,
      gender:
        typeof data.gender === "string"
          ? data.gender.toUpperCase()
          : data.gender,
      homeBase: (data as any).homeBase || (data as any).homeBaseLabel || "",
    });
    if (!parsed.success) {
      return {
        success: false as const,
        error: "Invalid form data",
        issues: parsed.error.flatten(),
      };
    }

    const values = parsed.data;
    if (!values.id) {
      return { success: false as const, error: "User ID missing" };
    }

    // Call the Prisma helper to update the user.  Note: CompleteProfile
    // currently expects a `homeBase` string but you may change this to
    await CompleteProfile(values.id, {
      image: values.image ?? null,
      firstName: values.firstName,
      lastName: values.lastName ?? undefined,
      birthday: values.birthday ?? "",
      gender: values.gender ?? "",
      homeBase: values.homeBase ?? "",
      occupation: values.occupation ?? undefined,
      languages: values.languages ?? [],
    });
    return { success: true as const };
  } catch (error) {
    return { success: false as const, error: (error as Error).message };
  }
}
