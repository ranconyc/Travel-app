import { prisma } from "./prisma";

export async function ensureGeoIndexes() {
  // create 2dsphere index on City.coords
  await prisma.$runCommandRaw({
    createIndexes: "City",
    indexes: [{ key: { coords: "2dsphere" }, name: "coords_2dsphere" }],
  });
  // create 2dsphere index on Activity.coords
  await prisma.$runCommandRaw({
    createIndexes: "Activity",
    indexes: [{ key: { coords: "2dsphere" }, name: "coords_2dsphere" }],
  });
}
