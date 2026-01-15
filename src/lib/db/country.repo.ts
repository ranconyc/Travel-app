import { Country } from "@/domain/country/country.schema";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { Glegoo } from "next/font/google";

type RestCountry = {
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

type LocationIqCountry = {
  lat: string;
  lon: string;
  display_name: string;
  boundingbox: string[];
};

/**
 * Optional mapping from region/subregion name to internal codes.
 * You can expand / tweak as you like.
 */
const REGION_CODES: Record<string, string> = {
  Africa: "AF",
  Americas: "AM",
  Asia: "AS",
  Europe: "EU",
  Oceania: "OC",
};

const SUB_REGION_CODES: Record<string, string> = {
  "South-Eastern Asia": "SEA",
  "Eastern Asia": "EAS",
  "Southern Asia": "SAS",
  "Northern Europe": "NEU",
  "Southern Europe": "SEU",
  "Western Europe": "WEU",
  "Eastern Europe": "EEU",
  "Northern America": "NAM",
  "South America": "SAM",
};

/**
 * Normalize countryId from ISO-2 code
 * e.g. "TH" -> "th"
 */
function makeCountryId(code2: string): string {
  return code2.toLowerCase();
}

// get all countries
export async function getAllCountries(): Promise<Country[]> {
  try {
    return await prisma.country.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("getAllCountries error:", error);
    throw new Error("Failed to fetch countries");
  }
}

//  get country with cities
export async function getCountryWithCities(slug: string) {
  if (!slug) return null;

  try {
    return await prisma.country.findUnique({
      where: { countryId: slug },
      include: {
        // all cities, ordered by name
        cities: {
          orderBy: { name: "asc" },
        },
        // include places for this country
        places: true,
        // include capital city relation if set
      },
    });
  } catch (error) {
    console.error("getCountryWithCities error:", error);
    throw new Error("Failed to fetch country");
  }
}

// find the 10 nearest countries
export async function findBorderCountries(bordersCCA3: string[]) {
  // console.log("bordersCCA3", bordersCCA3);
  if (!bordersCCA3?.length) return [];

  // 1) Load all countries that have meta (or just all countries)
  const countries = await prisma.country.findMany({
    where: {
      meta: {
        not: null,
      },
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      countryId: true,
      code: true,
      name: true,
      imageHeroUrl: true,
      meta: true,
    },
  });

  // 2) Filter by meta.cca3 in JS
  const filtered = countries.filter((c) => {
    const meta = c.meta as any;
    const cca3 = meta?.cca3;
    return cca3 && bordersCCA3.includes(cca3);
  });

  return filtered;
}

// fetch country metadata from REST Countries
async function fetchRestCountryByName(
  name: string
): Promise<RestCountry | null> {
  const url = new URL(
    `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`
  );
  // allow partial/loose name matches; you can set fullText=true if you want strict
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

  // For now, just take the first result
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

// fetch country metadata from LocationIQ
async function fetchLocationIqCountryByName(
  name: string
): Promise<LocationIqCountry | null> {
  const key = process.env.LOCATIONIQ_API_KEY;
  if (!key) {
    console.warn(
      "Missing LOCATIONIQ_API_KEY; skipping LocationIQ country lookup"
    );
    return null;
  }

  const url = new URL("https://us1.locationiq.com/v1/search");
  url.searchParams.set("key", key);
  url.searchParams.set("q", name);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString());
  if (!res.ok) {
    console.error("LocationIQ country search failed", res.status);
    return null;
  }

  const data = (await res.json()) as any[];
  if (!Array.isArray(data) || data.length === 0) return null;

  const item = data[0];

  return {
    lat: item.lat,
    lon: item.lon,
    display_name: item.display_name,
    boundingbox: item.boundingbox,
  };
}

/**
 * Create (or return existing) Country from a human-friendly country name.
 *
 * - Uses REST Countries for all metadata
 * - Fills your main schema fields
 * - Stores the entire REST object in `meta`
 */
export async function createCountryFromName(countryName: string) {
  const nameTrimmed = countryName.trim();
  if (!nameTrimmed) {
    throw new Error("Country name is required");
  }

  // 1) Fetch from REST Countries
  const rest = await fetchRestCountryByName(nameTrimmed);
  if (!rest || !rest.cca2) {
    throw new Error("Country not found in REST Countries API");
  }

  const code2 = rest.cca2.toUpperCase(); // e.g. "TH"
  const countryId = makeCountryId(code2); // e.g. "th"

  // 2) If already exists, just return it
  const existing = await prisma.country.findUnique({
    where: { countryId },
  });

  if (existing) {
    return { country: existing, created: false };
  }

  // 3) Compute region codes if you want them
  const region = rest.region ?? null;
  const subRegion = rest.subregion ?? null;

  const regionCode = (region && REGION_CODES[region]) || null;

  const subRegionCode = (subRegion && SUB_REGION_CODES[subRegion]) || null;

  // 4) Build structured Jsons from REST data
  const utilitiesJson = {
    timezones: rest.timezones ?? [],
    car: rest.car ?? null,
    postalCode: rest.postalCode ?? null,
    startOfWeek: rest.startOfWeek ?? null,
    landlocked: rest.landlocked ?? null,
  };

  const gettingAroundJson = {
    maps: rest.maps ?? null,
  };

  // You can later enrich these:
  const internetJson = null;
  const emergencyJson = null;
  const visaEntryJson = null;

  // Choose a good default hero image (for now: flag)
  const imageHeroUrl = rest.flags?.png ?? rest.flags?.svg ?? null;

  const images: string[] = [
    rest.flags?.png,
    rest.flags?.svg,
    rest.coatOfArms?.png,
    rest.coatOfArms?.svg,
  ].filter(Boolean) as string[];

  // 5) Build Prisma create input
  const data: Prisma.CountryCreateInput = {
    countryId,
    code: code2,
    name: rest.name?.common ?? nameTrimmed,

    officialName: rest.name?.official ?? rest.name?.common ?? null,

    continent: rest.continents?.[0] ?? rest.region ?? null,

    subRegion,
    regionCode,
    subRegionCode,

    capital: rest.capital?.[0] ?? null,

    population: rest.population ?? null,
    areaKm2: typeof rest.area === "number" ? rest.area : null,

    currency: rest.currencies ?? undefined,
    languageComm: rest.languages ?? undefined,

    utilities: utilitiesJson,
    gettingAround: gettingAroundJson,
    internet: internetJson,
    emergency: emergencyJson,
    visaEntry: visaEntryJson,

    imageHeroUrl,

    bestSeason: null,
    idealDuration: null,
    safety: null,

    regions: [],

    // keep the entire REST object for future use
    meta: rest as any,

    autoCreated: true,
    needsReview: true,
  };

  // 6) Create in DB
  const created = await prisma.country.create({ data });

  return { country: created, created: true };
}
