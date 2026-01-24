import { prisma } from "@/lib/db/prisma";
import world from "@/data/world.json";
import { updateCountry, deleteCountry } from "@/lib/db/country.repo";
import { CountryMapper } from "./country.mapper";

export type RestCountry = {
  name: {
    common: string;
    official: string;
    nativeName?: Record<
      string,
      {
        official: string;
        common: string;
      }
    >;
  };
  tld?: string[];
  cca2: string; // "TH"
  ccn3?: string;
  cca3?: string;
  cioc?: string;
  independent?: boolean;
  status?: string;
  unMember?: boolean;
  currencies?: Record<string, any>;
  idd?: {
    root?: string;
    suffixes?: string[];
  };
  capital?: string[];
  altSpellings?: string[];
  region?: string;
  subregion?: string;
  continents?: string[];
  languages?: Record<string, string>;
  latlng?: [number, number];
  landlocked?: boolean;
  borders?: string[];
  area?: number;
  demonyms?: Record<string, any>;
  translations?: Record<string, any>;
  flag?: string;
  maps?: {
    googleMaps?: string;
    openStreetMaps?: string;
  };
  population?: number;
  gini?: Record<string, number>;
  fifa?: string;
  car?: {
    signs?: string[];
    side?: string; // "left" | "right"
  };
  timezones?: string[];
  flags?: {
    png?: string;
    svg?: string;
    alt?: string;
  };
  coatOfArms?: {
    png?: string;
    svg?: string;
  };
  startOfWeek?: string;
  capitalInfo?: {
    latlng?: [number, number];
  };
  postalCode?: {
    format?: string;
    regex?: string;
  };
};

// fetch country metadata from REST Countries
async function fetchRestCountryByName(
  name: string,
): Promise<RestCountry | null> {
  const url = new URL(
    `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`,
  );
  url.searchParams.set("fullText", "false");

  const res = await fetch(url.toString());
  if (!res.ok) {
    console.error("REST Countries request failed", res.status);
    return null;
  }

  const data = (await res.json()) as any[];

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const country = data[0];

  const rest: RestCountry = {
    name: country.name,
    tld: country.tld,
    cca2: country.cca2,
    ccn3: country.ccn3,
    cca3: country.cca3,
    cioc: country.cioc,
    independent: country.independent,
    status: country.status,
    unMember: country.unMember,
    currencies: country.currencies,
    idd: country.idd,
    capital: country.capital,
    altSpellings: country.altSpellings,
    region: country.region,
    subregion: country.subregion,
    continents: country.continents,
    languages: country.languages,
    latlng: country.latlng,
    landlocked: country.landlocked,
    borders: country.borders,
    area: country.area,
    demonyms: country.demonyms,
    translations: country.translations,
    flag: country.flag,
    maps: country.maps,
    population: country.population,
    gini: country.gini,
    fifa: country.fifa,
    car: country.car,
    timezones: country.timezones,
    flags: country.flags,
    coatOfArms: country.coatOfArms,
    startOfWeek: country.startOfWeek,
    capitalInfo: country.capitalInfo,
    postalCode: country.postalCode,
  };

  return rest;
}

/**
 * Create (or return existing) Country from a human-friendly country name.
 * Orchestrates API calls and data mapping.
 */
export async function createCountryFromName(countryName: string) {
  const nameTrimmed = countryName.trim();
  if (!nameTrimmed) {
    throw new Error("Country name is required");
  }

  const countryRef = world.find(
    (c) => c.name.common.toLowerCase() === nameTrimmed.toLowerCase(),
  );
  console.log("Country ref", countryRef);
  if (!countryRef) {
    throw new Error("Country not found in the world");
  }

  // 1) Fetch from REST Countries
  const rest = await fetchRestCountryByName(nameTrimmed);
  console.log("REST Countries result", rest);

  if (!rest) {
    throw new Error("Country not found in REST Countries API");
  }

  const cca3 = rest.cca3?.toUpperCase();
  if (!cca3) {
    throw new Error("Country not found in REST Countries API (missing cca3)");
  }
  const code2 = rest.cca2.toUpperCase();

  // 2) If already exists, just return it
  const existing = await prisma.country.findUnique({
    where: { cca3 },
  });

  if (existing) {
    return { country: existing, created: false };
  }

  // 3) Orchestration & Mapping via CountryMapper
  const data = CountryMapper.toDb(rest, nameTrimmed);

  // 4) Save to DB (without capitalId first)
  const created = await prisma.country.create({ data });

  // 5) Auto-create Capital City if available, then link it back
  if (rest.capital?.[0]) {
    try {
      const { createCityFromName } = await import("@/domain/city/city.service");
      console.log(`Auto-generating capital city: ${rest.capital[0]}`);

      const capitalCity = await createCityFromName(rest.capital[0], code2);
      console.log("Capital city created:", capitalCity);

      // Update the country to link to the capital city
      if (capitalCity?.id) {
        await prisma.country.update({
          where: { id: created.id },
          data: {
            capitalId: capitalCity?.id,
            capitalName: rest.capital?.[0],
          },
        });
        console.log(
          `✅ Linked capital city ${rest.capital[0]} to ${created.name}`,
        );
      }
    } catch (error) {
      console.error("Failed to auto-create capital city:", error);
    }
  }

  return { country: created, created: true };
}

export async function handleUpdateCountry(id: string, data: any) {
  return await updateCountry(id, data);
}

export async function handleDeleteCountry(id: string) {
  return await deleteCountry(id);
}
export async function handleGetAllCountries(limit?: number, offset?: number) {
  const { getAllCountries } = await import("@/lib/db/country.repo");
  return await getAllCountries(limit, offset);
}
