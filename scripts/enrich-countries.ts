import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fields mapped from API:
// landlocked, coatOfArms, altSpellings, demonyms, gini, flag
// + existing: flags, population, areaKm2, borders, languages, maps, car, startOfWeek, independent, unMember

async function main() {
  console.log("Starting Country Enrichment...");

  // 1. Get all countries from DB
  const dbCountries = await prisma.country.findMany({
    select: { id: true, cca3: true, name: true },
  });

  console.log(`Found ${dbCountries.length} countries in DB to enrich.`);

  // 2. Prepare batches
  const BATCH_SIZE = 20;
  const dbBatches = [];
  for (let i = 0; i < dbCountries.length; i += BATCH_SIZE) {
    dbBatches.push(dbCountries.slice(i, i + BATCH_SIZE));
  }

  // Fields to request
  const fieldsParam = [
    "name",
    "cca3",
    "languages",
    "flags",
    "borders",
    "area",
    "independent",
    "unMember",
    "maps",
    "car",
    "startOfWeek",
    "landlocked",
    "coatOfArms",
    "altSpellings",
    "demonyms",
    "gini",
    "population",
    "flag",
  ].join(",");

  let totalUpdated = 0;
  let totalNotFound = 0;

  // 3. Process batches
  for (const batch of dbBatches) {
    const codes = batch
      .map((c) => c.cca3)
      .filter(Boolean)
      .join(",");

    if (!codes) continue;

    const url = `https://restcountries.com/v3.1/alpha?codes=${codes}&fields=${fieldsParam}`;

    /* 
       Note: We verify the URL doesn't exceed 2000 chars roughly. 
       20 codes * 3 chars + fields ~ 200 chars. Totally safe.
    */

    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        // If batch fails, log and continue (maybe one code is bad?)
        console.error(`Batch failed: ${resp.status}`);
        continue;
      }

      const apiData = await resp.json();

      // Update each country in this batch
      for (const dbCountry of batch) {
        const apiCountry = apiData.find((a: any) => a.cca3 === dbCountry.cca3);

        if (!apiCountry) {
          console.warn(`No API data for ${dbCountry.name} (${dbCountry.cca3})`);
          totalNotFound++;
          continue;
        }

        // --- MAPPING LOGIC (Same as before) ---
        const landlocked = apiCountry.landlocked || false;
        const coatOfArms = apiCountry.coatOfArms || null;
        const altSpellings = apiCountry.altSpellings || [];
        const demonyms = apiCountry.demonyms || null;
        const flag = apiCountry.flag || null;
        const gini = apiCountry.gini || null;
        const flags = apiCountry.flags || null;
        const officialName = apiCountry.name?.official || null;
        const areaKm2 = apiCountry.area || null;
        const isIndependent = apiCountry.independent ?? null;
        const isUnMember = apiCountry.unMember ?? null;
        const borders = apiCountry.borders || [];
        const languages = apiCountry.languages || null;
        const maps = apiCountry.maps || null;
        const startOfWeek = apiCountry.startOfWeek || null;
        const logisticsCar = apiCountry.car
          ? { side: apiCountry.car.side, signs: apiCountry.car.signs }
          : null;

        // Fetch current logistics to merge
        const currentCountry = await prisma.country.findUnique({
          where: { id: dbCountry.id },
          select: { logistics: true },
        });

        const currentLogistics: any = currentCountry?.logistics || {};
        const newLogistics = {
          ...currentLogistics,
          car: logisticsCar,
          startOfWeek: startOfWeek,
        };

        await prisma.country.update({
          where: { id: dbCountry.id },
          data: {
            landlocked,
            coatOfArms,
            altSpellings,
            demonyms,
            flag,
            gini,
            officialName,
            areaKm2,
            isIndependent,
            isUnMember,
            borders,
            flags,
            maps,
            languages,
            logistics: newLogistics,
          },
        });

        totalUpdated++;
      }

      console.log(`Processed batch. Total updated: ${totalUpdated}`);
    } catch (e) {
      console.error("Error processing batch:", e);
    }

    // Nice to carry on without hammering API
    // await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nEnrichment Process Completed.`);
  console.log(`Total Updated: ${totalUpdated}`);
  console.log(`Total Missing: ${totalNotFound}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
