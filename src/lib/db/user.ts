import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";

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
          include: {
            language: true,
          },
        },
      },
    });
  } catch (error) {
    console.log("getUser error", error);
    return null;
  }
}

type CompleteProfileFormValues = {
  image: string | null;
  firstName: string;
  lastName?: string;
  birthday: string;
  gender: "MALE" | "FEMALE" | "NON_BINARY" | "";
  homeBase: string;
  occupation?: string;
};

export async function CompleteProfile(
  userId: string,
  data: CompleteProfileFormValues
) {
  // convert date string to Date
  const birthdayDate = data.birthday ? new Date(data.birthday) : null;

  await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName || null,
      birthday: birthdayDate,
      gender: data.gender || null,
      occupation: data.occupation || null,
      description: undefined, // bio later
      image: data.image || undefined,
      // homeBase: כרגע בתור string, בסוף נמפה ל City אמיתי:
      // homeBaseCityId: ...
    },
  });

  // optional: לא לסמן profileCompleted עדיין – רק אחרי כל השלבים
  // await prisma.user.update({ where: { id: userId }, data: { profileCompleted: true } });

  revalidatePath("/profile/complete");
}
