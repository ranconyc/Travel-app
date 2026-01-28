import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fields defined in Zod CountrySchema
const ZOD_FIELDS = [
  "id",
  "cca3",
  "code",
  "name",
  "officialName",
  "imageHeroUrl",
  "population",
  "areaKm2",
  "borders",
  "tld",
  "independent",
  "unMember",
  "maps",
  "flags",
  "coords",
  "region",
  "subRegion",
  "capitalName",
  "capitalId",
  "logistics",
  "emergency",
  "finance",
  "culture",
  "safety",
  "health",
  "seasons",
  "languages",
  "needsReview",
  "autoCreated",
];

const NESTED_FIELDS_CHECK = {
  logistics: ["car", "idd", "electricity", "timezones", "startOfWeek"],
  finance: ["currency", "avgDailyCost", "cashCulture"],
  safety: ["overallScore", "soloFemaleFriendly", "crimeLevel", "scams"],
  health: ["tapWaterSafe", "vaccines", "medicalStandard"],
  seasons: ["peakMonths", "shoulderMonths", "bestTimeDisplay"],
  languages: ["official", "spoken", "nativeName", "codes"],
};

async function main() {
  console.log("Fetching all countries...");
  const countries = await prisma.country.findMany();
  console.log(`Found ${countries.length} countries.`);

  const foundTopLevel = new Set<string>();
  const foundNested: Record<string, Set<string>> = {
    logistics: new Set(),
    finance: new Set(),
    safety: new Set(),
    health: new Set(),
    seasons: new Set(),
    languages: new Set(),
  };

  countries.forEach((country) => {
    // Check top level
    Object.keys(country).forEach((key) => {
      if (country[key] !== null && country[key] !== undefined) {
        foundTopLevel.add(key);
      }
    });

    // Check nested
    Object.keys(NESTED_FIELDS_CHECK).forEach((jsonField) => {
      if (country[jsonField]) {
        const data = country[jsonField] as any;
        Object.keys(data).forEach((key) => {
          if (data[key] !== null && data[key] !== undefined) {
            foundNested[jsonField].add(key);
          }
        });
      }
    });
  });

  console.log("\n--- ANALYSIS RESULT ---");

  const missingTopLevel = ZOD_FIELDS.filter((f) => !foundTopLevel.has(f));
  if (missingTopLevel.length > 0) {
    console.log("\n❌ MISSING Top-Level Fields (Never found in any record):");
    missingTopLevel.forEach((f) => console.log(`  - ${f}`));
  } else {
    console.log("\n✅ All top-level Zod fields found in at least one record.");
  }

  console.log("\n--- Nested JSON Fields Analysis ---");
  Object.entries(NESTED_FIELDS_CHECK).forEach(([field, expectedKeys]) => {
    const found = Array.from(foundNested[field]);
    const missing = expectedKeys.filter((k) => !found.includes(k));

    if (missing.length > 0) {
      console.log(`\n❌ ${field.toUpperCase()} is missing keys:`);
      missing.forEach((k) => console.log(`  - ${k}`));
    } else {
      console.log(`✅ ${field.toUpperCase()} seems complete.`);
    }

    // Check for extra keys
    const extra = found.filter((k) => !expectedKeys.includes(k));
    if (extra.length > 0) {
      console.log(
        `  (Note: Found extra/legacy keys in ${field}: ${extra.join(", ")})`,
      );
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
