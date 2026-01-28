import { prisma } from "@/lib/db/prisma";
import { citiesArray } from "@/data/cities";
import { generateCitySlug } from "@/lib/utils/slug";
import { getCountryForCity, isMajorCapital } from "@/lib/utils/countryMapping";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🌱 Starting high-quality database seed (cost-effective)...");

  console.log(`📚 Seeding ${citiesArray.length} golden cities...`);
  
  let successCount = 0;
  let errorCount = 0;
  const existingSlugs: string[] = [];

  // First, get existing slugs to avoid conflicts
  try {
    const existingCities = await prisma.city.findMany({
      select: { cityId: true } as any
    });
    existingSlugs.push(...existingCities.map((c: any) => c.cityId).filter(Boolean));
    console.log(`📋 Found ${existingSlugs.length} existing slugs`);
  } catch (error) {
    console.log("📋 No existing cities found");
  }

  for (const cityName of citiesArray) {
    try {
      const countryName = getCountryForCity(cityName);
      const isCapital = isMajorCapital(cityName);
      const priority = isCapital ? 100 : 80;
      
      // Generate slug
      let slug = generateCitySlug(countryName, cityName);
      
      // Ensure uniqueness
      if (existingSlugs.includes(slug)) {
        let counter = 1;
        let uniqueSlug = `${slug}-${counter}`;
        while (existingSlugs.includes(uniqueSlug)) {
          counter++;
          uniqueSlug = `${slug}-${counter}`;
        }
        slug = uniqueSlug;
      }
      existingSlugs.push(slug);

      // Prepare city data (NO Google Place ID fetching during bulk seeding)
      const cityData: any = {
        cityId: slug,
        name: cityName,
        slug,
        isVerified: true, // Golden cities are verified
        priority,
        isCapital,
        countryRefId: null, // Will be populated when country relations are established
        autoCreated: false,
        needsReview: false,
        googlePlaceId: null, // Will be fetched during individual city creation
      };

      // Upsert city with data integrity
      await prisma.city.upsert({
        where: { cityId: cityData.cityId },
        update: {
          ...cityData,
          updatedAt: new Date(),
        },
        create: cityData,
      });

      successCount++;
      console.log(`✅ Processed: ${cityName} (${countryName}) - Priority: ${priority} - Slug: ${slug}`);

    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to process ${cityName}:`, error);
    }
  }

  console.log(`\n🎉 Seeding completed!`);
  console.log(`✅ Successfully processed: ${successCount} cities`);
  console.log(`❌ Failed: ${errorCount} cities`);
  console.log(`🔍 All cities are marked as verified golden cities`);
  console.log(`🏆 Major capitals assigned priority 100, others priority 80`);
  console.log(`💰 Google Place IDs will be fetched during individual city creation to save costs`);
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
