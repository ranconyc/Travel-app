/**
 * Country-related type definitions
 * Based on domain/country/country.schema.ts
 */

import { Country as CountrySchema } from "@/domain/country/country.schema";

/**
 * Re-export Country from schema
 */
export type Country = CountrySchema;

/**
 * Country data from REST Countries API
 */
export type RestCountry = {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  cca3: string;
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area?: number;
  flags: {
    png: string;
    svg: string;
  };
  languages?: Record<string, string>;
  currencies?: Record<
    string,
    {
      name: string;
      symbol: string;
    }
  >;
  borders?: string[];
};
