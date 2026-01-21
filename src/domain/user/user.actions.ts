"use server";

import { z } from "zod";
import {
  createSafeAction,
  createPublicAction,
  createAdminAction,
} from "@/lib/safe-action";
import { prisma } from "@/lib/db/prisma";
import { findNearestCityFromCoords } from "@/domain/city/city.service";
import { completeProfileSchema } from "@/domain/user/completeProfile.schema";
import {
  saveInterestsSchema,
  saveTravelSchema,
  savePersonaSchema,
  BioInputSchema,
} from "@/domain/user/user.schema";
import {
  deleteUserAccount,
  getAllUsers,
  updateVisitedCountries,
} from "@/lib/db/user.repo";
import {
  completeProfile,
  saveUserInterests,
  updateUserProfilePersona,
} from "@/domain/user/user.service";

/* -------------------------------------------------------------------------- */
/*                                USER ACTIONS                                */
/* -------------------------------------------------------------------------- */

// Standardized ActionResponse is imported from @/types/actions

export const updateProfile = createSafeAction(
  completeProfileSchema,
  async (data, userId) => {
    await completeProfile(userId, data);
  },
);

export const deleteAccountAction = createSafeAction(
  z.any(),
  async (_, userId) => {
    await deleteUserAccount(userId);
  },
);

/* -------------------------------------------------------------------------- */
/*                            TRAVEL PREFERENCES                              */
/* -------------------------------------------------------------------------- */

// Standardized ActionResponse used

export const saveInterests = createSafeAction(
  saveInterestsSchema,
  async (data, userId) => {
    await saveUserInterests(userId, data);
    return { userId };
  },
);

/* -------------------------------------------------------------------------- */
/*                               BIO GENERATION                               */
/* -------------------------------------------------------------------------- */

function safeAge(birthday: string): number | null {
  const d = new Date(birthday);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age >= 0 && age < 120 ? age : null;
}

function formatLanguages(
  langs?: { code: string; name: string }[],
): string | null {
  if (!langs || langs.length === 0) return null;
  const names = langs.map((l) => l.name).slice(0, 3);
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names[0]}, ${names[1]} and ${names[2]}`;
}

export const generateBio = createPublicAction(BioInputSchema, async (data) => {
  const { firstName, occupation, hometown, birthday, languages } = data;
  const ageMaybe = safeAge(birthday);
  const ageText = ageMaybe ? `${ageMaybe}-year-old` : "";
  const langsText = formatLanguages(languages);
  const langsClause = langsText ? ` I speak ${langsText}.` : "";
  const base = `I'm ${firstName}, a ${
    ageText ? `${ageText} ` : ""
  }${occupation} from ${hometown}.`;

  return {
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
});

/* -------------------------------------------------------------------------- */
/*                                TRAVEL DATA                                 */
/* -------------------------------------------------------------------------- */

// Standardized ActionResponse used

export const saveVisitedCountries = createSafeAction(
  saveTravelSchema,
  async (data, userId) => {
    await updateVisitedCountries(userId, data.countries);
    return { userId };
  },
);

export const saveTravelPersona = createSafeAction(
  savePersonaSchema,
  async (data, userId) => {
    await updateUserProfilePersona(userId, data);
    return { userId };
  },
);

export const getAllUsersAction = createAdminAction(z.any(), async () => {
  return getAllUsers();
});

export const updateUserRoleAction = createAdminAction(
  z.object({
    userId: z.string(),
    role: z.enum(["USER", "ADMIN"]),
  }),
  async (data) => {
    const { updateUserRole } = await import("@/lib/db/user.repo");
    await updateUserRole(data.userId, data.role);
  },
);

export const updateUserLocationAction = createSafeAction(
  z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  async (coords, userId) => {
    const detected = await findNearestCityFromCoords(coords.lat, coords.lng, {
      createIfMissing: true,
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        currentLocation: {
          type: "Point",
          coordinates: [coords.lng, coords.lat],
        },
        currentCityId: detected.id ?? undefined,
      },
    });

    return { detected };
  },
);
