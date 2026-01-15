import { prisma } from "@/lib/db/prisma";

export async function ensureGeoIndexes(): Promise<void> {
  try {
    await prisma.$runCommandRaw({
      createIndexes: "City",
      indexes: [{ key: { coords: "2dsphere" }, name: "coords_2dsphere" }],
    });

    await prisma.$runCommandRaw({
      createIndexes: "Activity",
      indexes: [{ key: { coords: "2dsphere" }, name: "coords_2dsphere" }],
    });
  } catch (error) {
    console.error("ensureGeoIndexes error:", error);
    throw new Error("Failed to ensure geo indexes");
  }
}
