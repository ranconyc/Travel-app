import * as fs from "fs";
import * as path from "path";

const dataPath = path.join(
  process.cwd(),
  "src/data/countries+states+cities.json",
);
const rawData = fs.readFileSync(dataPath, "utf8");
const countries = JSON.parse(rawData);

function calculateStats(items: any[], type: string) {
  if (items.length === 0) return {};

  const allKeys = new Set<string>();
  items.forEach((item) => {
    Object.keys(item).forEach((key) => allKeys.add(key));
  });

  const stats: Record<string, { count: number; percentage: string }> = {};
  const total = items.length;

  allKeys.forEach((key) => {
    const count = items.filter(
      (item) =>
        item[key] !== null && item[key] !== undefined && item[key] !== "",
    ).length;
    stats[key] = {
      count,
      percentage: ((count / total) * 100).toFixed(2) + "%",
    };
  });

  return stats;
}

const countryStats = calculateStats(countries, "Country");

const allStates: any[] = [];
countries.forEach((c: any) => {
  if (c.states) allStates.push(...c.states);
});
const stateStats = calculateStats(allStates, "State");

const allCities: any[] = [];
allStates.forEach((s: any) => {
  if (s.cities) allCities.push(...s.cities);
});
const cityStats = calculateStats(allCities, "City");

console.log("### COUNTRY STATS ###");
console.table(countryStats);

console.log("\n### STATE STATS ###");
console.table(stateStats);

console.log("\n### CITY STATS ###");
console.table(cityStats);
