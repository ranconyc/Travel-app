import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkIndexes() {
  const collectionName = "City";
  const db = (prisma as any)._baseClient?._db || (prisma as any)._engine?._db;

  // aggregateRaw can be used to run commands too? No, usually it's for pipelines.
  // We can try to run a findRaw or just see if we can get index info.

  try {
    const res = await (prisma as any).$runCommandRaw({
      listIndexes: "City",
    });
    console.log("Indexes on City:", JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("Error listing indexes:", err);
  }

  await prisma.$disconnect();
}

checkIndexes();
