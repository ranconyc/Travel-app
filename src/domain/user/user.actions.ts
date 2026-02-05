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
  BioInputSchema,
} from "@/domain/user/user.schema";
import {
  completeProfile,
  saveUserInterests,
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
} from "@/lib/db/user.repo";

import { mapUiToDb } from "@/domain/persona/persona.mapper";
import { InsightsEngine } from "@/domain/persona/insights.engine";
import { PersonaFormValues } from "@/domain/persona/persona.schema";
import { onboardingIdentitySchema } from "@/domain/user/onboarding.schema";

/* -------------------------------------------------------------------------- */
/*                                USER ACTIONS                                */
/* -------------------------------------------------------------------------- */

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

export const completeOnboarding = createSafeAction(
  z.object({
    interests: z.array(z.string()),
    budget: z.string(),
    travelRhythm: z.string(),
  }),
  async (data, userId) => {
    // Update user profile with onboarding data and set profileCompleted to true
    const dbModel = mapUiToDb(data as unknown as PersonaFormValues);
    const insights = InsightsEngine.generate(dbModel);
    const insightCodes = insights.map((i) => i.code);

    await saveUserInterests(userId, {
      firstName: "", // Will be filled later in complete profile
      hometown: "",
      avatarUrl: undefined,
      interests: dbModel.interests,
      dailyRhythm: dbModel.dailyRhythm as any,
      travelStyle: dbModel.travelStyle as any,
      budget: dbModel.budget as any,
      currency: dbModel.currency,
      insights: insightCodes,
    });

    // Update profileCompleted flag directly in database
    await updateUserRole(userId, "USER");

    return { success: true };
  },
);

export const completeIdentityOnboarding = createSafeAction(
  onboardingIdentitySchema,
  async (data, userId) => {
    // === SERVER-SIDE VALIDATIONS ===

    // Check 1: Prevent re-submission if already onboarded
    const { prisma } = await import("@/lib/db/prisma");
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        profile: {
          select: {
            firstName: true,
            homeBaseCityId: true,
            birthday: true,
            gender: true,
          },
        },
        avatarUrl: true,
      },
    });

    const profile = existingUser?.profile;
    const isAlreadyOnboarded =
      !!profile?.firstName &&
      !!profile?.homeBaseCityId &&
      !!profile?.birthday &&
      !!profile?.gender &&
      !!existingUser?.avatarUrl;

    if (isAlreadyOnboarded) {
      throw new Error("Profile is already complete. Use settings to edit.");
    }

    // Check 2: Validate age >= 18 (business rule - can't be bypassed)
    const { day, month, year } = data.birthday;
    const birthDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
    );
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      throw new Error("You must be 18 years or older to use this app.");
    }

    // === END VALIDATIONS ===

    // 1. Parse Birthday (format: YYYY-MM-DD)
    const birthdayString = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    // 2. Get Name (already split in form)
    const firstName = data.firstName;
    const lastName = data.lastName || "";

    // 3. Resolve City - This is required for onboarding
    let homeBaseCityId: string | undefined;

    if (!data.location.coords || !data.location.countryCode) {
      throw new Error("Please select a valid city from the suggestions");
    }

    const placeId = data.location.placeId;
    const coords = {
      lat: data.location.coords.coordinates[1],
      lng: data.location.coords.coordinates[0],
    };

    // Step A: Check if city already exists in DB (by placeId)
    if (placeId && !placeId.startsWith("json_")) {
      const { prisma } = await import("@/lib/db/prisma");
      const existingCity = await prisma.city.findUnique({
        where: { id: placeId },
        select: { id: true },
      });

      if (existingCity) {
        homeBaseCityId = existingCity.id;
      }
    }

    // Step B: If not in DB, check if it's a JSON city
    if (!homeBaseCityId && placeId?.startsWith("json_")) {
      const jsonCityId = parseInt(placeId.replace("json_", ""), 10);

      if (!isNaN(jsonCityId)) {
        const { findOrCreateCity } = await import("@/domain/city/city.service");

        const city = await findOrCreateCity(
          data.location.name,
          data.location.countryCode,
          coords,
          jsonCityId,
        );

        if (city?.id) {
          homeBaseCityId = city.id;
        }
      }
    }

    // Step C: Last resort - use geocoding (LocationIQ) to create city
    if (!homeBaseCityId) {
      const { ensureCountryAndCityFromLocation } =
        await import("@/domain/city/city.service");
      const { buildCityMeta } = await import("@/domain/city/city.utils");

      const meta = buildCityMeta({
        name: data.location.name,
        countryCode: data.location.countryCode,
        stateCode: data.location.stateCode,
        stateType: data.location.stateType,
        lat: coords.lat,
        lng: coords.lng,
        provider: "onboarding-geocode",
        placeId: placeId || "unknown",
      });

      const locResult = await ensureCountryAndCityFromLocation(meta);

      if (locResult?.city?.id) {
        homeBaseCityId = locResult.city.id;
      }
    }

    // Hard fail if city resolution failed
    if (!homeBaseCityId) {
      throw new Error(
        "We couldn't save your location. Please try selecting a different city.",
      );
    }

    // 4. Save Profile
    await handleUpsertUserProfile(userId, {
      firstName,
      lastName,
      gender: data.gender,
      birthday: birthdayString,
      homeBaseCityId,
      avatarUrl: data.avatarUrl,
    });

    return { success: true };
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
    const { headers } = await import("next/headers");
    const { revalidatePath } = await import("next/cache");

    const headerList = await headers();
    const ipCountry = headerList.get("x-vercel-ip-country") || undefined;

    const result = await handleUpdateUserLocation(userId, coords, ipCountry);
    revalidatePath(`/profile/${userId}`);
    revalidatePath("/"); // Also refresh homepage for nearby recommendations
    return result;
  },
);

export const getAuthenticatedUserAction = createSafeAction(
  z.object({}),
  async (_, userId) => {
    return await handleGetAuthenticatedUser(userId);
  },
);
