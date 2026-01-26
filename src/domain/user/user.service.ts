import { prisma } from "@/lib/db/prisma";
import { CompleteProfileFormValues } from "@/domain/user/completeProfile.schema";
import { findNearestCityFromCoords } from "@/domain/city/city.service";
import { DetectedCity } from "@/domain/city/city.schema";
import * as userRepository from "@/lib/db/user.repo";
import { getAge } from "@/domain/shared/utils/age";

/**
 * Retrieves the current authenticated user with full profile data.
 * Used for reactive client-side state synchronization.
 */
export async function handleGetAuthenticatedUser(userId: string) {
  return await userRepository.getUserById(userId, { strategy: "full" });
}

/**
 * Completes the user profile with the provided data.
 */
export async function completeProfile(
  userId: string,
  data: CompleteProfileFormValues,
): Promise<void> {
  if (!userId) {
    throw new Error("User ID missing");
  }

  const birthdayDate =
    data.birthday && data.birthday.length > 0 ? new Date(data.birthday) : null;

  const genderEnum =
    data.gender === ""
      ? null
      : (data.gender as "MALE" | "FEMALE" | "NON_BINARY");

  try {
    await userRepository.updateFullProfile(userId, {
      profileCompleted: true,
      name: `${data.firstName} ${data.lastName}`.trim(),
      profile: {
        upsert: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName || null,
            birthday: birthdayDate,
            gender: genderEnum,
            occupation: data.occupation || null,
            socials: data.socialLinks || null,
            languages: data.languages,
          },
          update: {
            firstName: data.firstName,
            lastName: data.lastName || null,
            birthday: birthdayDate,
            gender: genderEnum,
            occupation: data.occupation || null,
            socials: data.socialLinks || null,
            languages: data.languages,
          },
        },
      },
    });

    if (data.avatarUrl) {
      await userRepository.updateUserAvatar(userId, data.avatarUrl);
    }
  } catch (error) {
    console.error("completeProfile error:", error);
    throw new Error("Failed to update profile");
  }
}

/**
 * Updates the user profile persona with the provided data.
 */
export async function updateUserProfilePersona(
  userId: string,
  newPersonaData: Record<string, unknown>,
): Promise<void> {
  if (!userId) {
    throw new Error("User ID missing");
  }

  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { persona: true },
    });

    const existingPersona =
      (userProfile?.persona as Record<string, unknown>) || {};
    const mergedPersona = {
      ...existingPersona,
      ...newPersonaData,
    };

    await userRepository.updateUserPersona(userId, mergedPersona);
  } catch (error) {
    console.error("updateUserProfilePersona error:", error);
    throw new Error("Failed to update user persona");
  }
}

/**
 * Saves the user's interests and persona data.
 */
export async function saveUserInterests(
  userId: string,
  data: {
    interests: string[];
    dailyRhythm: string;
    travelStyle: string;
    budget?: string;
    currency?: string;
    firstName?: string;
    hometown?: string;
    avatarUrl?: string;
    insights?: string[];
  },
): Promise<void> {
  const hasBasicInfo = data.firstName || data.avatarUrl;

  if (hasBasicInfo) {
    const updateData: any = {};
    if (data.firstName) updateData.name = data.firstName;
    if (data.avatarUrl) updateData.avatarUrl = data.avatarUrl;

    await userRepository.updateFullProfile(userId, {
      ...updateData,
      ...(data.firstName
        ? {
            profile: {
              upsert: {
                create: { firstName: data.firstName },
                update: { firstName: data.firstName },
              },
            },
          }
        : {}),
    });
  }

  return updateUserProfilePersona(userId, {
    interests: data.interests,
    dailyRhythm: data.dailyRhythm,
    travelStyle: data.travelStyle,
    budget: data.budget,
    currency: data.currency,
    hometown: data.hometown,
    insights: data.insights,
  });
}

/**
 * Handles the update of the user's location.
 */
export async function handleUpdateUserLocation(
  userId: string,
  coords: { lat: number; lng: number },
): Promise<{ detected: DetectedCity }> {
  const { lat, lng } = coords;

  const detected = await findNearestCityFromCoords(lat, lng, {
    createIfMissing: true,
    searchRadiusKm: 120,
  });

  if (!detected || !detected.id) {
    throw new Error("Could not identify city");
  }

  const { getActiveVisit, createCityVisit, closeCityVisit } =
    await import("@/lib/db/cityVisit.repo");
  const activeVisit = await getActiveVisit(userId);

  if (!activeVisit) {
    await createCityVisit(userId, detected.id, { lat, lng });
  } else if (activeVisit.cityId !== detected.id) {
    await closeCityVisit(activeVisit.id, { lat, lng });
    await createCityVisit(userId, detected.id, { lat, lng });
  }

  await userRepository.updateUserLocation(
    userId,
    {
      type: "Point",
      coordinates: [lng, lat],
    },
    detected.id,
  );

  return { detected: detected as any }; // Cast for schema compatibility
}

/**
 * Generates a bio for the user based on their profile data.
 * Consolidates display-string formatting into a clean business rule.
 */
export async function handleGenerateBio(data: {
  firstName: string;
  occupation: string;
  hometown: string;
  birthday: string;
  languages?: { code: string; name: string }[];
}) {
  const { firstName, occupation, hometown, birthday, languages } = data;
  const age = getAge(birthday);
  const ageText = age ? `${age}-year-old` : "";

  const langs = languages?.map((l) => l.name).slice(0, 3) || [];
  let langsText = "";
  if (langs.length === 1) langsText = langs[0];
  else if (langs.length === 2) langsText = `${langs[0]} and ${langs[1]}`;
  else if (langs.length >= 3)
    langsText = `${langs[0]}, ${langs[1]} and ${langs[2]}`;

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
}
