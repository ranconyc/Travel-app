import { prisma } from "./prisma";

export async function getUserById(id: string) {
  console.log("getUser", id);
  if (!id) return null;
  try {
    return await prisma.user.findUnique({
      where: { id }, // same field name as Prisma model
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        profileCompleted: true,
        languages: {
          include: {
            language: true, // pulls actual language data (not just join table)
          },
        },
      },
    });
  } catch (error) {
    console.log("getUser error", error);
    return null;
  }
}
