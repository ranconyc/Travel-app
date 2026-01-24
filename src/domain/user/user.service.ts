import { prisma } from "@/lib/db/prisma";
import { CompleteProfileFormValues } from "@/domain/user/completeProfile.schema";
import { findNearestCityFromCoords } from "@/domain/city/city.service";
import { DetectedCity } from "@/types/city";

/**
 * Completes the user profile with the provided data.
 * @param userId - The ID of the user to update.
 * @param data - The profile data to update.
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
    await prisma.user.update({
      where: { id: userId },
      data: {
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
      },
    });

    if (data.avatarUrl) {
      await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: data.avatarUrl },
      });
    }
  } catch (error) {
    console.error("completeProfile error:", error);
    throw new Error("Failed to update profile");
  }
}
/**
 * Updates the user profile persona with the provided data.
 * @param userId - The ID of the user to update.
 * @param newPersonaData - The persona data to update.
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
    const mergedPersona = JSON.parse(
      JSON.stringify({
        ...existingPersona,
        ...newPersonaData,
      }),
    );

    await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: {
              persona: mergedPersona,
            },
            update: {
              persona: mergedPersona,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("updateUserProfilePersona error:", error);
    throw new Error("Failed to update user persona");
  }
}

/**
 * Saves the user's interests to their profile.
 * @param userId - The ID of the user to update.
 * @param data - The interests data to save.
 */
export async function saveUserInterests(
  userId: string,
  data: {
    interests: string[];
    dailyRhythm: string;
    travelStyle: string;
  },
): Promise<void> {
  return updateUserProfilePersona(userId, data);
}

/**
 * Handles the update of the user's location.
 * @param userId - The ID of the user to update.
 * @param coords - The coordinates of the user's location.
 */
export async function handleUpdateUserLocation(
  userId: string,
  coords: { lat: number; lng: number },
): Promise<{ detected: DetectedCity }> {
  const { lat, lng } = coords;
  console.log("[handleUpdateUserLocation] Start", userId, coords);

  // 1. Resolve city from coordinates (DB or API)
  const detected = await findNearestCityFromCoords(lat, lng, {
    createIfMissing: true,
    searchRadiusKm: 120, // Consistent with location.actions.ts logic
  });

  if (!detected || !detected.id) {
    throw new Error("Could not identify city");
  }

  // 2. Handle city visit tracking (imported from repo)
  const { getActiveVisit, createCityVisit, closeCityVisit } =
    await import("@/lib/db/cityVisit.repo");
  const activeVisit = await getActiveVisit(userId);

  if (!activeVisit) {
    // First visit or no active visit - create new one
    await createCityVisit(userId, detected.id, { lat, lng });
  } else if (activeVisit.cityId !== detected.id) {
    // Changed cities - close current visit and create new one
    await closeCityVisit(activeVisit.id, { lat, lng });
    await createCityVisit(userId, detected.id, { lat, lng });
  }

  // 3. Update user's current location and city
  await prisma.user.update({
    where: { id: userId },
    data: {
      currentLocation: {
        type: "Point",
        coordinates: [lng, lat],
      },
      currentCityId: detected.id,
    },
  });

  console.log("[handleUpdateUserLocation] Success", detected.cityName);
  return { detected };
}

/**
 * Calculates the age from a birthday string.
 * @param birthday - The birthday string.
 * @returns The age as a number, or null if the birthday is invalid.
 */
function safeAge(birthday: string): number | null {
  const d = new Date(birthday);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age >= 0 && age < 120 ? age : null;
}

/**
 * Formats the user's languages for display.
 * @param langs - The languages to format.
 * @returns The formatted languages string, or null if the user has no languages.
 */
function formatLanguages(
  langs?: { code: string; name: string }[],
): string | null {
  if (!langs || langs.length === 0) return null;
  const names = langs.map((l) => l.name).slice(0, 3);
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names[0]}, ${names[1]} and ${names[2]}`;
}

/**
 * Generates a bio for the user based on their profile data.
 * @param data - The profile data to generate the bio from.
 * @returns The generated bio.
 */
export async function handleGenerateBio(data: {
  firstName: string;
  occupation: string;
  hometown: string;
  birthday: string;
  languages?: { code: string; name: string }[];
}) {
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
}
