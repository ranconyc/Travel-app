import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDb() {
  const cityCount = await prisma.city.count();
  console.log(`Total cities in DB: ${cityCount}`);

  if (cityCount > 0) {
    const sampleCity = await prisma.city.findFirst({
      include: { country: true },
    });
    console.log("Sample City:", JSON.stringify(sampleCity, null, 2));
  }

  const countryCount = await prisma.country.count();
  console.log(`Total countries in DB: ${countryCount}`);

  const user = await prisma.user.findFirst({
    where: { email: "ranconyc@gmail.com" }, // Assuming this is the user
  });
  console.log(
    "Current User Location:",
    JSON.stringify(user?.currentLocation, null, 2),
  );

  await prisma.$disconnect();
}

checkDb();
