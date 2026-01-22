import { prisma } from "@/lib/db/prisma";
import { CompleteProfileFormValues } from "@/domain/user/completeProfile.schema";
import { findNearestCityFromCoords } from "@/domain/city/city.service";
import { DetectedCity } from "@/types/city";

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

    if (data.image) {
      await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: data.image },
      });
    }
  } catch (error) {
    console.error("completeProfile error:", error);
    throw new Error("Failed to update profile");
  }
}

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

export async function handleUpdateUserLocation(
  userId: string,
  coords: { lat: number; lng: number },
): Promise<{ detected: DetectedCity }> {
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
}

export async function handleUpdateUserRole(
  userId: string,
  role: "USER" | "ADMIN",
): Promise<void> {
  const { updateUserRole } = await import("@/lib/db/user.repo");
  await updateUserRole(userId, role);
}

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

export async function handleDeleteUserAccount(userId: string) {
  const { deleteUserAccount } = await import("@/lib/db/user.repo");
  return await deleteUserAccount(userId);
}

export async function handleUpdateVisitedCountries(
  userId: string,
  countries: string[],
) {
  const { updateVisitedCountries } = await import("@/lib/db/user.repo");
  return await updateVisitedCountries(userId, countries);
}

export async function handleGetAllUsers() {
  const { getAllUsers } = await import("@/lib/db/user.repo");
  return await getAllUsers();
}
