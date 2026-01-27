"use server";

import { z } from "zod";
import {
  createSafeAction,
  createPublicAction,
  createAdminAction,
} from "@/lib/safe-action";
import { completeProfileSchema } from "@/domain/user/completeProfile.schema";
import {
  saveInterestsSchema,
  saveTravelSchema,
  savePersonaSchema,
  BioInputSchema,
} from "@/domain/user/user.schema";
import {
  completeProfile,
  saveUserInterests,
  updateUserProfilePersona,
  handleUpdateUserLocation,
  handleGenerateBio,
  handleGetAuthenticatedUser,
  handleUpsertUserProfile,
} from "@/domain/user/user.service";
import { UserUpdateSchema } from "./userUpdate.schema";
import {
  deleteUserAccount,
  getAllUsers,
  updateUserRole,
  updateVisitedCountries,
} from "@/lib/db/user.repo";

import { mapUiToDb } from "@/domain/persona/persona.mapper";
import { InsightsEngine } from "@/domain/persona/insights.engine";
import { PersonaFormValues } from "@/domain/persona/persona.schema";

/* -------------------------------------------------------------------------- */
/*                                USER ACTIONS                                */
/* -------------------------------------------------------------------------- */

// Standardized ActionResponse is imported from @/types/actions

export const upsertUserProfile = createSafeAction(
  UserUpdateSchema,
  async (data, userId) => {
    return await handleUpsertUserProfile(userId, data);
  },
);

export const updateProfile = createSafeAction(
  completeProfileSchema,
  async (data, userId) => {
    await completeProfile(userId, data);
  },
);

export const deleteAccountAction = createSafeAction(
  z.object({}),
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
    // 1. Map UI Values to DB Model
    // We cast to PersonaFormValues because the schema is nearly identical,
    // assuming safeInterestsSchema has all fields required by mapper.
    const dbModel = mapUiToDb(data as unknown as PersonaFormValues);

    // 2. Generate Insights
    const insights = InsightsEngine.generate(dbModel);
    const insightCodes = insights.map((i) => i.code);

    // 3. Save to DB
    await saveUserInterests(userId, {
      firstName: data.firstName,
      hometown: data.hometown,
      avatarUrl: data.avatarUrl,
      interests: dbModel.interests,
      dailyRhythm: dbModel.dailyRhythm as any,
      travelStyle: dbModel.travelStyle as any,
      budget: dbModel.budget as any,
      currency: dbModel.currency,
      insights: insightCodes,
    });

    return { userId };
  },
);

/* -------------------------------------------------------------------------- */
/*                               BIO GENERATION                               */
/* -------------------------------------------------------------------------- */

export const generateBio = createPublicAction(BioInputSchema, async (data) => {
  return await handleGenerateBio(data);
});

/* -------------------------------------------------------------------------- */
/*                                TRAVEL DATA                                 */
/* -------------------------------------------------------------------------- */

// Standardized ActionResponse used

export const saveVisitedCountries = createSafeAction(
  saveTravelSchema,
  async (data, userId) => {
    const { handleSaveVisitedCountries } =
      await import("@/domain/user/user.service");
    await handleSaveVisitedCountries(userId, data.countries);
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

export const getAllUsersAction = createAdminAction(z.object({}), async () => {
  return await getAllUsers();
});

export const updateUserRoleAction = createAdminAction(
  z.object({
    userId: z.string(),
    role: z.enum(["USER", "ADMIN"]),
  }),
  async (data) => {
    await updateUserRole(data.userId, data.role);
  },
);

export const updateUserLocationAction = createSafeAction(
  z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  async (coords, userId) => {
    const { revalidatePath } = await import("next/cache");
    const result = await handleUpdateUserLocation(userId, coords);
    revalidatePath(`/profile/${userId}`);
    return result;
  },
);

export const getAuthenticatedUserAction = createSafeAction(
  z.object({}),
  async (_, userId) => {
    return await handleGetAuthenticatedUser(userId);
  },
);
