// src/app/profile/actions/updateProfile.ts
"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  completeProfileSchema,
  type CompleteProfileFormValues,
} from "@/domain/user/completeProfile.schema";

type UpdateProfileResult =
  | { success: true }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string>;
    };

export async function updateProfile(
  rawValues: CompleteProfileFormValues
): Promise<UpdateProfileResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "UNAUTHENTICATED" };
  }

  // Server-side validation with the SAME Zod schema
  const parsed = completeProfileSchema.safeParse(rawValues);

  if (!parsed.success) {
    const flat = parsed.error.flatten();

    // Map Zod errors -> { [fieldName]: "message" }
    const fieldErrors: Record<string, string> = {};
    for (const [name, messages] of Object.entries(flat.fieldErrors)) {
      if (messages && messages[0]) {
        fieldErrors[name] = messages[0];
      }
    }

    return {
      success: false,
      error: "VALIDATION_ERROR",
      fieldErrors,
    };
  }

  const values = parsed.data;

  console.log("updateProfile", values);

  const birthdayDate = values.birthday ? new Date(values.birthday) : null;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      image: values.image ?? null,
      imagePublicId: values.imagePublicId ?? null,
      firstName: values.firstName,
      lastName: values.lastName || null,
      occupation: values.occupation || null,
      birthday: birthdayDate,
      gender: values.gender === "" ? null : values.gender,
      languages: values.languages, // ["en","he"]

      profileCompleted: true,
    },
  });

  return { success: true };
}
