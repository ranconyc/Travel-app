// scripts/debug-country-update.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { prisma } from "../src/lib/db/prisma";

async function main() {
  console.log("Debugging Country Update...");

  // 1. Find a country to update (e.g., France or USA)
  const country = await prisma.country.findFirst({
    where: {
      OR: [{ name: "France" }, { cca3: "FRA" }, { cca3: "USA" }],
    },
  });

  if (!country) {
    console.error("Target country not found!");
    return;
  }

  console.log(`Found country: ${country.name} (${country.id})`);
  console.log(`Current imageHeroUrl: ${country.imageHeroUrl}`);

  // 2. Update with a test image
  const testImage =
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=80";

  const updated = await prisma.country.update({
    where: { id: country.id },
    data: {
      imageHeroUrl: testImage,
    },
  });

  console.log(`Updated imageHeroUrl: ${updated.imageHeroUrl}`);

  // 3. Verify it persists
  const check = await prisma.country.findUnique({
    where: { id: country.id },
  });

  console.log(`Verification fetch: ${check?.imageHeroUrl}`);
  if (check?.imageHeroUrl === testImage) {
    console.log("SUCCESS: Database update persisted.");
  } else {
    console.error("FAILURE: Database update did not persist.");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
