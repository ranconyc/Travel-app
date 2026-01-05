"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  completeProfileSchema,
  type CompleteProfileFormValues,
} from "@/domain/user/completeProfile.schema";
import { findOrCreateCity } from "@/lib/db/cityLocation.repo";
import { completeProfile } from "@/lib/db/user.repo";

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
  // console.log("updating profile...", values);
  // console.log("Creating new city from location:", values.homeBaseLocation);
  // console.log(
  //   "Created city with ID:",
  //   city.id,
  //   "Setting homeBaseCityId to:",
  //   homeBaseCityId
  // );
  // console.log("Profile updated successfully", result);

  return { success: true };
}
