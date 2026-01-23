import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const protectedUserIds = [
  "696865f7c219a48e1f398b4d",
  "6968b1fdc77fef63ef841510",
  "696b49bf24c1f49dee0c0dd9",
  "696e7cc2c45270419840685a",
  "69717941ea0442766386c891",
];

async function main() {
  console.log("Starting user cleanup...");
  console.log(`Protected IDs: ${protectedUserIds.length}`);

  try {
    const result = await prisma.user.deleteMany({
      where: {
        id: {
          notIn: protectedUserIds,
        },
      },
    });

    console.log(`Successfully deleted ${result.count} users.`);

    const remainingCount = await prisma.user.count();
    console.log(`Remaining users in DB: ${remainingCount}`);

    const remainingUsers = await prisma.user.findMany({
      select: { id: true, name: true },
    });
    console.log(
      "Remaining User IDs:",
      remainingUsers.map((u) => u.id),
    );
  } catch (error) {
    console.error("Cleanup failed:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
