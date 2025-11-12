import { prisma } from "../src/lib/db/prisma";
import cities from "../src/data/cities.json" assert { type: "json" };

async function main() {
  console.log("🌱 Starting database seed...");

  // Seed cities
  console.log("📚 Seeding cities...");
  let citiesCount = 0;

  for (const city of cities) {
    await prisma.city.upsert({
      where: { cityId: city.cityId }, // ✅ fixed (was city.id)
      update: {
        cityId: city.cityId,
        name: city.name,
        countryRefId: city.countryRefId,
        coords: city.coords,
        radiusKm: city.radiusKm,
        imageHeroUrl: city.imageHeroUrl,
        images: city.images,
        bestSeason: city.bestSeason,
        idealDuration: city.idealDuration,
        safety: city.safety,
        neighborhoods: city.neighborhoods,
        budget: city.budget,
        gettingAround: city.gettingAround,
        activities: { create: city.activities },
      },
      create: {
        cityId: city.cityId,
        name: city.name,
        countryRefId: city.countryRefId,
        coords: city.coords,
        radiusKm: city.radiusKm,
        imageHeroUrl: city.imageHeroUrl,
        images: city.images,
        bestSeason: city.bestSeason,
        idealDuration: city.idealDuration,
        safety: city.safety,
        neighborhoods: city.neighborhoods,
        budget: city.budget,
        gettingAround: city.gettingAround,
        activities: { create: city.activities },
      },
    });
    citiesCount++;
  }

  console.log(`✅ Seeded ${citiesCount} cities`);
  console.log("✨ Seed completed successfully!");
}

main()
  .then(() => {
    console.log("✅ Seed complete: Thailand + Bangkok");
  })
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
