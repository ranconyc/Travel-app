import { prisma } from "../src/lib/db/prisma";
import cities from "../src/data/cities.json" assert { type: "json" };

async function main() {
  console.log("🌱 Starting database seed...");

  // Seed cities
  console.log("📚 Seeding cities...");
  let citiesCount = 0;

  for (const city of cities) {
    const { activities, images, ...cityData } = city as any;

    await prisma.city.upsert({
      where: { cityId: city.cityId },
      update: {
        ...cityData,
        places: {
          create: activities || [],
        },
      },
      create: {
        ...cityData,
        places: {
          create: activities || [],
        },
      },
    });
    citiesCount++;
  }

  console.log(`✅ Seeded ${citiesCount} cities`);
  console.log("✨ Seed completed successfully!");
}

main()
  .then(() => {
    console.log("✅ Seed complete");
  })
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
