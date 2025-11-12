import { prisma } from "@/lib/db/prisma";

export async function getAllLanguages() {
  console.log("getting all languages....");

  try {
    return await prisma.language.findMany({
      orderBy: {
        name: "asc", // Alphabetical order for easier selection
      },
      select: {
        id: true,
        code: true,
        name: true,
        nativeName: true,
        flag: true,
        // Don't include users relation - not needed for language picker
      },
    });
  } catch (error) {
    console.log("getAllLanguages error", error);
    return null;
  }
}
