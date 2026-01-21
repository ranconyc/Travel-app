/**
 * Bulk Country Seeder
 *
 * Seeds all countries from world.json using REST Countries API.
 * Sets autoCreated=true and needsReview=true for all countries.
 *
 * Usage: npx tsx scripts/seed-countries.ts
 */

import { PrismaClient } from "@prisma/client";
import world from "../src/data/world.json";
import { createCountryFromName } from "../src/domain/country/country.service";

const prisma = new PrismaClient();

async function main() {
  console.log(`🌍 Starting bulk country seed...`);
  console.log(`📊 Total countries in world.json: ${world.length}`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const country of world) {
    try {
      console.log(`\n🔄 Processing: ${country.name.common}...`);

      const result = await createCountryFromName(country.name.common);

      if (result.created) {
        created++;
        console.log(
          `✅ Created: ${country.name.common} (${result.country.cca3})`,
        );
      } else {
        skipped++;
        console.log(`⏭️  Skipped (already exists): ${country.name.common}`);
      }
    } catch (error) {
      failed++;
      console.error(`❌ Failed: ${country.name.common}`);
      console.error(
        `   Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    // Rate limiting: wait 500ms between requests to avoid overwhelming REST Countries API
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log(`\n\n📈 Seeding Complete!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Created:  ${created}`);
  console.log(`⏭️  Skipped:  ${skipped}`);
  console.log(`❌ Failed:   ${failed}`);
  console.log(`📊 Total:    ${world.length}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  // Show review status
  const needsReviewCount = await prisma.country.count({
    where: { needsReview: true },
  });

  console.log(`⚠️  Countries needing review: ${needsReviewCount}`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Visit /admin/destinations to review countries`);
  console.log(`   2. Enrich high-priority countries with missing data`);
  console.log(`   3. Set needsReview=false when complete\n`);
}

main()
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
