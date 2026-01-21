import { prisma } from "@/lib/db/prisma";
import { CompleteProfileFormValues } from "@/domain/user/completeProfile.schema";

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
  newPersonaData: Record<string, any>,
): Promise<void> {
  if (!userId) {
    throw new Error("User ID missing");
  }

  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { persona: true },
    });

    const existingPersona = (userProfile?.persona as Record<string, any>) || {};
    const mergedPersona = { ...existingPersona, ...newPersonaData };

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
