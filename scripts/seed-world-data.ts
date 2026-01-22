import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(
    process.cwd(),
    "src/data/countries+states+cities.json",
  );
  console.log("Reading data from:", dataPath);

  const rawData = fs.readFileSync(dataPath, "utf8");
  const countries = JSON.parse(rawData);

  console.log(`Found ${countries.length} countries in JSON.`);

  // Limit for testing
  const limit = process.env.LIMIT ? parseInt(process.env.LIMIT) : 2;
  const subset = countries.slice(0, limit);

  console.log(`Processing first ${subset.length} countries...`);

  for (const countryData of subset) {
    console.log(`Starting country: ${countryData.name} (${countryData.iso3})`);

    // --- ENRICHED MAPPING ---

    // Formatting finance data
    const finance = {
      currency: {
        code: countryData.currency,
        name: countryData.currency_name,
        symbol: countryData.currency_symbol,
      },
    };

    // Formatting logistics (idd and timezones)
    const logistics = {
      idd: {
        root: `+${countryData.phonecode}`,
        suffixes: [], // JSON doesn't provide suffixes separately
      },
      timezones: countryData.timezones?.map((tz: any) => tz.zoneName) || [],
    };

    // 1. Upsert Country
    const country = await prisma.country.upsert({
      where: { cca3: countryData.iso3 },
      update: {
        name: countryData.name,
        code: countryData.iso2,
        population: countryData.population,
        region: countryData.region,
        subRegion: countryData.subregion,
        capitalName: countryData.capital,
        finance: finance,
        logistics: logistics,
        tld: countryData.tld ? [countryData.tld] : [],
        translations: countryData.translations,
        coords: {
          type: "Point",
          coordinates: [
            parseFloat(countryData.longitude),
            parseFloat(countryData.latitude),
          ],
        },
      },
      create: {
        cca3: countryData.iso3,
        code: countryData.iso2,
        name: countryData.name,
        population: countryData.population,
        region: countryData.region,
        subRegion: countryData.subregion,
        capitalName: countryData.capital,
        finance: finance,
        logistics: logistics,
        tld: countryData.tld ? [countryData.tld] : [],
        translations: countryData.translations,
        coords: {
          type: "Point",
          coordinates: [
            parseFloat(countryData.longitude),
            parseFloat(countryData.latitude),
          ],
        },
      },
    });

    // 2. Process States
    if (countryData.states) {
      console.log(`  Processing ${countryData.states.length} states...`);
      for (const stateData of countryData.states) {
        const state = await prisma.state.upsert({
          where: { stateId: stateData.id },
          update: {
            name: stateData.name,
            native: stateData.native,
            code: stateData.iso2,
            type: stateData.type,
            countryRefId: country.id,
            translations: stateData.translations || null,
            coords: stateData.latitude
              ? {
                  type: "Point",
                  coordinates: [
                    parseFloat(stateData.longitude),
                    parseFloat(stateData.latitude),
                  ],
                }
              : null,
          },
          create: {
            stateId: stateData.id,
            name: stateData.name,
            native: stateData.native,
            code: stateData.iso2,
            type: stateData.type,
            countryRefId: country.id,
            translations: stateData.translations || null,
            coords: stateData.latitude
              ? {
                  type: "Point",
                  coordinates: [
                    parseFloat(stateData.longitude),
                    parseFloat(stateData.latitude),
                  ],
                }
              : null,
          },
        });

        // 3. Process Cities
        if (stateData.cities && stateData.cities.length > 0) {
          for (const cityData of stateData.cities) {
            const citySlug = cityData.name
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "-");

            await prisma.city.upsert({
              where: { externalId: cityData.id },
              update: {
                name: cityData.name,
                countryRefId: country.id,
                stateId: state.id,
                timeZone: cityData.timezone,
                coords: {
                  type: "Point",
                  coordinates: [
                    parseFloat(cityData.longitude),
                    parseFloat(cityData.latitude),
                  ],
                },
              },
              create: {
                externalId: cityData.id,
                cityId: `${citySlug}-${cityData.id}`,
                name: cityData.name,
                countryRefId: country.id,
                stateId: state.id,
                timeZone: cityData.timezone,
                coords: {
                  type: "Point",
                  coordinates: [
                    parseFloat(cityData.longitude),
                    parseFloat(cityData.latitude),
                  ],
                },
                autoCreated: true,
              },
            });
          }
        }
      }
    }
    console.log(`Finished country: ${countryData.name}`);
  }

  console.log("Enriched seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
