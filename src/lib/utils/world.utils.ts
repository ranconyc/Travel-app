import world from "@/data/world.json";
import continentOrder from "@/data/continents.json";

export interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  cca2: string;
  cca3: string;
  region: string;
  subregion: string;
  continents: string[];
  flag: string;
}

export const getStructuredWorld = () => {
  const structure: Record<string, string[]> = {};

  // Initialize with the defined order
  continentOrder.forEach((region) => {
    structure[region] = [];
  });

  // Populate subregions
  (world as Country[]).forEach((country) => {
    const { region, subregion } = country;
    // Handle the case where a region might not be in our preferred order list
    if (!structure[region]) {
      structure[region] = [];
    }

    const sub = subregion || "Antarctic"; // Fallback for empty subregion
    if (!structure[region].includes(sub)) {
      structure[region].push(sub);
    }
  });

  return {
    structure,
    continentOrder,
    allCountries: world as Country[],
  };
};
