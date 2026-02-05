import { PrismaClient } from "@prisma/client";
import { createCityFromJson } from "@/domain/city/city-creation.service";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function seedCapitals() {
  console.log("🚀 Starting Capital City Seeding...");

  const filePath = path.join(
    process.cwd(),
    "src/data/countries+states+cities.json",
  );
  const data = fs.readFileSync(filePath, "utf-8");
  const countries = JSON.parse(data);

  let successCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  const skippedCapitals: {
    country: string;
    capital: string;
    reason: string;
  }[] = [];

  for (const country of countries) {
    if (country.capital) {
      let foundCity = null;
      for (const state of country.states) {
        for (const city of state.cities) {
          if (city.name === country.capital) {
            foundCity = city;
            break;
          }
        }
        if (foundCity) break;
      }

      if (foundCity) {
        try {
          process.stdout.write(
            `Processing ${country.name} (${country.capital})... `,
          );

          // Check if already exists in DB
          const existing = await prisma.city.findFirst({
            where: { externalId: foundCity.id },
          });

          if (existing) {
            console.log("✅ Already exists.");
            skippedCount++;
          } else {
            await createCityFromJson(foundCity.id);
            console.log("✨ Created!");
            successCount++;
          }

          // Update Country to link capital
          const dbCountry = await prisma.country.findFirst({
            where: { cca3: country.iso3 },
          });

          if (dbCountry) {
            const dbCity = await prisma.city.findUnique({
              where: { externalId: foundCity.id },
            });

            if (dbCity) {
              await prisma.country.update({
                where: { id: dbCountry.id },
                data: {
                  capitalCity: { connect: { id: dbCity.id } },
                  capitalName: country.capital,
                },
              });
            }
          }
        } catch (error) {
          console.log("❌ Failed: " + (error as Error).message);
          failedCount++;
          skippedCapitals.push({
            country: country.name,
            capital: country.capital,
            reason: `Error: ${(error as Error).message}`,
          });
        }
      } else {
        console.log(
          `⚠️  Skipping ${country.name}: Capital '${country.capital}' not found in JSON cities list.`,
        );
        skippedCount++;
        skippedCapitals.push({
          country: country.name,
          capital: country.capital,
          reason: "Not found in JSON cities list",
        });
      }
    }
  }

  // Write skipped capitals to file
  const skippedPath = path.join(process.cwd(), "src/data/skippedCapitals.json");
  fs.writeFileSync(skippedPath, JSON.stringify(skippedCapitals, null, 2));
  console.log(`\n💾 Saved skipped capitals to ${skippedPath}`);

  console.log("\n------------------------------------------------");
  console.log(
    `🎉 Finished! Created: ${successCount}, Skipped: ${skippedCount}, Failed: ${failedCount}`,
  );
  console.log("------------------------------------------------\n");
}

seedCapitals()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
