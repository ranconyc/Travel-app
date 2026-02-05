import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function inspectCity() {
  const washington = await prisma.city.findFirst({
    where: { name: { contains: "Washington", mode: "insensitive" } },
    include: { country: true },
  });

  console.log("Washington City Data:", JSON.stringify(washington, null, 2));

  if (washington) {
    console.log("Coords type:", typeof washington.coords);
    console.log("Coords value:", washington.coords);
  }

  await prisma.$disconnect();
}

inspectCity();
