import { Language } from "@/domain/user/user.schema";
import { prisma } from "./prisma";

/**
 * Fetch user with relations
 */
export async function getUserById(id: string) {
  console.log("getUser", id);
  if (!id) return null;

  try {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        homeBaseCity: {
          include: { country: true },
        },
        travelPersona: true,
        interests: {
          include: { interest: true },
        },
        languages: {
          include: { language: true },
        },
      },
    });
  } catch (error) {
    console.log("getUser error", error);
    return null;
  }
}

/**
 * Form values coming from the profile step
 */
export type CompleteProfileFormValues = {
  image: string | null;
  firstName: string;
  lastName?: string;
  birthday: string; // ISO string
  gender: "MALE" | "FEMALE" | "NON_BINARY" | ""; // form version
  homeBase: string; // cityId string (later map to homeBaseCityId)
  occupation?: string;
  languages: Language[];
};

export async function CompleteProfile(
  userId: string,
  data: CompleteProfileFormValues
) {
  if (!userId) throw new Error("User ID missing");

  // Convert date string → Date
  const birthdayDate =
    data.birthday && data.birthday.length > 0 ? new Date(data.birthday) : null;

  // Form may return "" for gender → convert to null
  const genderEnum =
    data.gender === ""
      ? null
      : (data.gender as "MALE" | "FEMALE" | "NON_BINARY");

  // Convert image: keep null → null, empty → undefined (no update)
  const imageValue =
    data.image === "" || data.image === null ? undefined : data.image;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName || null,
        birthday: birthdayDate,
        gender: genderEnum,
        occupation: data.occupation || null,
        description: undefined,
        image: imageValue,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("CompleteProfile error:", error);
    return { success: false, error: (error as Error).message };
  }
}
