import { prisma } from "@/lib/db/prisma";

async function createIndex(
  collectionName: string,
  indexName: string,
  fieldName: string = "coords"
) {
  console.log(
    `Creating geospatial index for ${collectionName}.${fieldName}...`
  );
  try {
    const res = await prisma.$runCommandRaw({
      createIndexes: collectionName,
      indexes: [
        {
          key: {
            [fieldName]: "2dsphere",
          },
          name: indexName,
        },
      ],
    });
    console.log(
      `${collectionName} Index result:`,
      JSON.stringify(res, null, 2)
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error creating ${collectionName} index:`, message);
  }
}

async function main() {
  // City
  await createIndex("City", "city_coords_2dsphere", "coords");

  // Activity
  await createIndex("Activity", "activity_coords_2dsphere", "coords");

  // Country
  await createIndex("Country", "country_coords_2dsphere", "coords");

  // User
  await createIndex("User", "user_currentLocation_2dsphere", "currentLocation");

  await prisma.$disconnect();
}

main();
