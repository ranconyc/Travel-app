"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import {
  completeProfileSchema,
  type CompleteProfileFormValues,
} from "@/domain/user/completeProfile.schema";
import { completeProfile } from "@/lib/db/user.repo";
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
    await prisma.chat.updateMany({
      where: {
        lastMessage: {
          senderId: userId,
        },
      },
      data: {
        lastMessageId: null,
      },
    });

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    console.error("Failed to delete user account:", error);
    throw new Error("Failed to delete account");
  }

  redirect("/");
}

/* -------------------------------------------------------------------------- */
/*                            TRAVEL PREFERENCES                              */
/* -------------------------------------------------------------------------- */

// export type TravelPreferencesFormValues = {
//   preferences: Record<string, string[]>;
// };

// export async function saveTravelPreferences(data: TravelPreferencesFormValues) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id) {
//     throw new Error("User not authenticated");
//   }

//   const userId = session.user.id;
//   const preferences = data.preferences ?? {};
//   const interestSlugs = Array.from(new Set(Object.values(preferences).flat()));

//   if (interestSlugs.length === 0) {
//     await prisma.userInterest.deleteMany({
//       where: { userId },
//     });
//     return { ok: true, removedAll: true, created: 0 };
//   }

//   const interests = await prisma.interest.findMany({
//     where: { slug: { in: interestSlugs } },
//     select: { id: true, slug: true },
//   });

//   if (interests.length === 0) {
//     await prisma.userInterest.deleteMany({
//       where: { userId },
//     });
//     return { ok: true, removedAll: true, created: 0 };
//   }

//   const interestIds = interests.map((i) => i.id);

//   const result = await prisma.$transaction(async (tx) => {
//     await tx.userInterest.deleteMany({ where: { userId } });
//     const createResult = await tx.userInterest.createMany({
//       data: interestIds.map((interestId) => ({
//         userId,
//         interestId,
//         weight: 1,
//       })),
//     });
//     return { createdCount: createResult.count };
//   });

//   return {
//     ok: true,
//     created: result.createdCount,
//     interestIds,
//   };
// }

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
