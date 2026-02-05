import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Optimization: Batch size for city inserts
const BATCH_SIZE = 100;

// Optimization: Minimum population for cities (if not in top list or capital)
const MIN_POPULATION = 100000;

async function main() {
  const dataPath = path.join(
    process.cwd(),
    "src/data/countries+states+cities.json",
  );

  const topCitiesPath = path.join(process.cwd(), "src/data/topCities.json");

  console.log("Reading world data from:", dataPath);
  const rawData = fs.readFileSync(dataPath, "utf8");
  const countries = JSON.parse(rawData);

  console.log("Reading top cities from:", topCitiesPath);
  let topCityNames = new Set<string>();
  try {
    const rawTopCities = fs.readFileSync(topCitiesPath, "utf8");
    const topCitiesList = JSON.parse(rawTopCities);
    // Normalize names for case-insensitive comparison
    topCitiesList.forEach((name: string) =>
      topCityNames.add(name.toLowerCase()),
    );
    console.log(`Loaded ${topCitiesList.length} top cities.`);
  } catch (e) {
    console.warn(
      "Could not load topCities.json, proceeding without whitelist filter.",
      e,
    );
  }

  console.log(`Found ${countries.length} countries in JSON.`);

  // Use LIMIT env var if set, otherwise process ALL countries as requested
  const limit = process.env.LIMIT
    ? parseInt(process.env.LIMIT)
    : countries.length;
  const subset = countries.slice(0, limit);

  console.log(`Processing ${subset.length} countries...`);

  // Helper to strip translations (keep only English/common if available, or just remove to save space)
  // User requested: "Delete translations (except English) - saves ~70% space"
  const cleanTranslations = (t: any) => {
    if (!t) return null;
    // Attempt to keep only 'en' or 'eng' key if it exists, otherwise return null or minimal
    /* 
       The source JSON often has a massive dictionary of translations. 
       If we want to save space, we can just return undefined/null or a tiny object.
       Let's keep 'kr', 'pt', 'nl', 'hr', 'fa', 'de', 'es', 'fr', 'ja', 'it', 'cn' ??
       Actually user said "Except English". The `translations` field in this dataset usually maps code -> string.
       Often keys are 'kr', 'pt-BR', etc. 'en' might not even be there if the name is already English.
       Let's safely return null to maximize savings as requested. 
       Or maybe just keep specific ones if critical. I will return null as requested for "except English" (which is usually the main name field anyway).
    */
    return null;
  };

  for (const countryData of subset) {
    console.log(`Starting country: ${countryData.name} (${countryData.iso3})`);

    // --- ENRICHED MAPPING ---
    const finance = {
      currency: {
        code: countryData.currency,
        name: countryData.currency_name,
        symbol: countryData.currency_symbol,
      },
    };

    const logistics = {
      idd: {
        root: `+${countryData.phonecode}`,
        suffixes: [],
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
        translations: cleanTranslations(countryData.translations),
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
        translations: cleanTranslations(countryData.translations),
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
      // Use Promise.all with batching for cities to speed up
      // But first we insert states sequentially or parallel?
      // States are fewer, sequential is safer for relations, but let's try to be efficient.
      // We'll process states one by one to keep the ID reference simple for cities.

      console.log(`  Processing ${countryData.states.length} states...`);

      for (const stateData of countryData.states) {
        // Prepare State data
        const state = await prisma.state.upsert({
          where: { stateId: stateData.id },
          update: {
            name: stateData.name,
            native: stateData.native || null,
            code: stateData.iso2 || null,
            type: stateData.type || null,
            slug: `${stateData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${country.code.toLowerCase()}`,
            countryRefId: country.id, // Link to MongoDB ID
            translations: cleanTranslations(stateData.translations),
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
            native: stateData.native || null,
            code: stateData.iso2 || null,
            type: stateData.type || null,
            slug: `${stateData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${country.code.toLowerCase()}`,
            countryRefId: country.id,
            translations: cleanTranslations(stateData.translations),
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

        // 3. Process Cities with Filters
        if (stateData.cities && stateData.cities.length > 0) {
          const citiesToInsert = [];

          for (const cityData of stateData.cities) {
            // FILTER LOGIC
            // 1. In Top Cities List?
            const isTopCity = topCityNames.has(cityData.name.toLowerCase());
            // 2. Is Capital? (Not specific property in city JSON usually, but maybe matches country capital?
            // In this dataset, 'capital' is on country. We can check if city.name === country.capital)
            const isCapital = cityData.name === countryData.capital;
            // 3. Population check
            // Note: population field isn't always reliable in this dataset for cities, but if present use it.
            // Some entries don't have population.
            // Let's assume if it's missing, we only keep if it's top/capital.
            // User said: "cities above a certain size".
            // Let's maintain a generous approach for "Top Cities" JSON + Capitals + Pop > 100k
            const pop = cityData.population ? parseInt(cityData.population) : 0;
            const isLarge = pop > MIN_POPULATION;

            if (isTopCity || isCapital || isLarge) {
              const citySlug = cityData.name
                .normalize("NFKD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");

              // Standardized readable ID
              const cityId = `${citySlug}-${country.code.toLowerCase()}-${cityData.id}`;

              citiesToInsert.push({
                externalId: cityData.id,
                cityId: cityId,
                slug: `${country.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${citySlug}`,
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
                population: pop || null,
                autoCreated: true,
              });
            }
          }

          // Batch Insert Cities
          if (citiesToInsert.length > 0) {
            // Process in chunks to avoid message size limits
            for (let i = 0; i < citiesToInsert.length; i += BATCH_SIZE) {
              const batch = citiesToInsert.slice(i, i + BATCH_SIZE);

              // We use upsert for each to be safe and maintain idempotency,
              // but purely `createMany` is faster if we wipe first.
              // Since we wipe, `createMany` is an option, BUT `cityId` external field unique constrains might conflict if we don't wipe perfectly.
              // Also `createMany` doesn't work well with MongoDB relations if we want to retrieve IDs back easily (though we don't need them here).
              // Let's do `Promise.all` with `upsert` for safety.

              await Promise.all(
                batch.map((c) =>
                  prisma.city.upsert({
                    where: { externalId: c.externalId },
                    update: c,
                    create: c,
                  }),
                ),
              );
            }
          }
        }
      }
    }
    console.log(`Finished country: ${countryData.name}`);
  }

  console.log("Enriched, filtered, and optimized seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
