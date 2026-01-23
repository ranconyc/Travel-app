import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BATCH_SIZE = 1000;

async function deleteCitiesInBatches() {
  let totalDeleted = 0;
  let hasMore = true;

  console.log("Deleting cities in batches...");

  while (hasMore) {
    // Find a batch of city IDs
    const cities = await prisma.city.findMany({
      select: { id: true },
      take: BATCH_SIZE,
    });

    if (cities.length === 0) {
      hasMore = false;
      break;
    }

    // Delete this batch
    const result = await prisma.city.deleteMany({
      where: {
        id: { in: cities.map((c) => c.id) },
      },
    });

    totalDeleted += result.count;
    console.log(`  Deleted ${result.count} cities (total: ${totalDeleted})`);
  }

  return totalDeleted;
}

async function deleteStatesInBatches() {
  let totalDeleted = 0;
  let hasMore = true;

  console.log("Deleting states in batches...");

  while (hasMore) {
    const states = await prisma.state.findMany({
      select: { id: true },
      take: BATCH_SIZE,
    });

    if (states.length === 0) {
      hasMore = false;
      break;
    }

    const result = await prisma.state.deleteMany({
      where: {
        id: { in: states.map((s) => s.id) },
      },
    });

    totalDeleted += result.count;
    console.log(`  Deleted ${result.count} states (total: ${totalDeleted})`);
  }

  return totalDeleted;
}

async function deleteCountriesInBatches() {
  let totalDeleted = 0;
  let hasMore = true;

  console.log("Deleting countries in batches...");

  while (hasMore) {
    const countries = await prisma.country.findMany({
      select: { id: true },
      take: BATCH_SIZE,
    });

    if (countries.length === 0) {
      hasMore = false;
      break;
    }

    const result = await prisma.country.deleteMany({
      where: {
        id: { in: countries.map((c) => c.id) },
      },
    });

    totalDeleted += result.count;
    console.log(`  Deleted ${result.count} countries (total: ${totalDeleted})`);
  }

  return totalDeleted;
}

async function main() {
  console.log("Starting cleanup of world data...");
  console.log(`Using batch size: ${BATCH_SIZE}\n`);

  try {
    // Delete in order: Cities -> States -> Countries (respecting foreign key constraints)
    const citiesDeleted = await deleteCitiesInBatches();
    console.log(`✓ Deleted ${citiesDeleted} cities\n`);

    const statesDeleted = await deleteStatesInBatches();
    console.log(`✓ Deleted ${statesDeleted} states\n`);

    const countriesDeleted = await deleteCountriesInBatches();
    console.log(`✓ Deleted ${countriesDeleted} countries\n`);

    console.log("✅ World data cleanup completed successfully!");
    console.log(
      `Summary: ${citiesDeleted} cities, ${statesDeleted} states, ${countriesDeleted} countries deleted.`,
    );
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
