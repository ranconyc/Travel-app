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
  handleUpdateUserRole,
  handleGenerateBio,
  handleDeleteUserAccount,
  handleGetAllUsers,
  handleUpdateVisitedCountries,
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
    await handleDeleteUserAccount(userId);
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
    await handleUpdateVisitedCountries(userId, data.countries);
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
  return await handleGetAllUsers();
});

export const updateUserRoleAction = createAdminAction(
  z.object({
    userId: z.string(),
    role: z.enum(["USER", "ADMIN"]),
  }),
  async (data) => {
    await handleUpdateUserRole(data.userId, data.role);
  },
);

export const updateUserLocationAction = createSafeAction(
  z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  async (coords, userId) => {
    return await handleUpdateUserLocation(userId, coords);
  },
);
