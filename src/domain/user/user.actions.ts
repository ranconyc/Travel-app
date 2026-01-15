"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  completeProfileSchema,
  type CompleteProfileFormValues,
} from "@/domain/user/completeProfile.schema";
import {
  completeProfile,
  deleteUserAccount,
  saveUserInterests,
} from "@/lib/db/user.repo";
import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                                USER ACTIONS                                */
/* -------------------------------------------------------------------------- */

export type UpdateProfileResult =
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

  try {
    await completeProfile(session.user.id, parsed.data);
    return { success: true };
  } catch (error) {
    console.error("updateProfile action error:", error);
    return {
      success: false,
      error: "INTERNAL_SERVER_ERROR",
    };
  }
}

export async function deleteAccount() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  try {
    await deleteUserAccount(userId);
  } catch (error) {
    console.error("Failed to delete user account:", error);
    throw new Error("Failed to delete account");
  }

  redirect("/");
}

/* -------------------------------------------------------------------------- */
/*                            TRAVEL PREFERENCES                              */
/* -------------------------------------------------------------------------- */

const saveInterestsSchema = z.object({
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  dailyRhythm: z.string().min(1, "Please select a daily rhythm"),
  travelStyle: z.string().min(1, "Please select a travel style"),
});

export type SaveInterestsFormValues = z.infer<typeof saveInterestsSchema>;

export type SaveInterestsResult =
  | { success: true; userId: string }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string>;
    };

export async function saveInterests(
  rawValues: SaveInterestsFormValues
): Promise<SaveInterestsResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "UNAUTHENTICATED" };
  }

  const parsed = saveInterestsSchema.safeParse(rawValues);

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

  try {
    await saveUserInterests(session.user.id, parsed.data);
    return { success: true, userId: session.user.id };
  } catch (error) {
    console.error("saveInterests action error:", error);
    return {
      success: false,
      error: "INTERNAL_SERVER_ERROR",
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                               BIO GENERATION                               */
/* -------------------------------------------------------------------------- */

const BioInputSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  occupation: z.string().min(1, "Occupation is required"),
  hometown: z.string().min(1, "Hometown is required"),
  birthday: z.string().min(1, "Birthday is required"),
  languages: z
    .array(
      z.object({
        code: z.string(),
        name: z.string(),
      })
    )
    .optional(),
  gender: z.enum(["male", "female"]).optional(),
});

type BioInput = z.infer<typeof BioInputSchema>;

function safeAge(birthday: string): number | null {
  const d = new Date(birthday);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age >= 0 && age < 120 ? age : null;
}

function formatLanguages(langs?: BioInput["languages"]): string | null {
  if (!langs || langs.length === 0) return null;
  const names = langs.map((l) => l.name).slice(0, 3);
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names[0]}, ${names[1]} and ${names[2]}`;
}

export async function generateBio(input: BioInput) {
  const parsed = BioInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Missing or invalid required fields",
      issues: parsed.error.flatten(),
    };
  }

  const { firstName, occupation, hometown, birthday, languages } = parsed.data;
  const ageMaybe = safeAge(birthday);
  const ageText = ageMaybe ? `${ageMaybe}-year-old` : "";
  const langsText = formatLanguages(languages);
  const langsClause = langsText ? ` I speak ${langsText}.` : "";
  const base = `I'm ${firstName}, a ${
    ageText ? `${ageText} ` : ""
  }${occupation} from ${hometown}.`;

  return {
    ok: true as const,
    options: [
      {
        id: "formal",
        label: "Formal",
        text: `${base} I value meaningful connections and enjoy engaging conversations about travel and culture.${langsClause}`,
      },
      {
        id: "chill",
        label: "Chill",
        text: `${base} I’m easygoing, love exploring new spots, and I’m always down for good coffee and better stories.${langsClause}`,
      },
      {
        id: "funny",
        label: "Funny",
        text: `${base} Professional overpacker, part-time snack critic, and full-time ${occupation}. If there’s great food or a hidden alley to explore—I’m in.${langsClause}`,
      },
    ],
  };
}
