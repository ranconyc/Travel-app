import { Prisma } from "@prisma/client";
import { type RestCountry } from "./country.service";

/**
 * CountryMapper - Single Source of Truth for mapping External API data (REST Countries)
 * to our internal Domain Entities and Prisma Schema.
 */
export class CountryMapper {
  /**
   * Maps REST Countries API response to our Domain-aligned create input.
   * Handles the "5 Travel Insights" as specified in the Architecture Audit.
   */
  public static toDb(
    rest: RestCountry,
    nameFallback: string,
  ): Prisma.CountryCreateInput {
    const cca3 = rest.cca3?.toUpperCase() || "";
    const code2 = rest.cca2?.toUpperCase() || "";

    // 1. Social Landscape (Population, Languages, Gini)
    const languages = rest.languages || null;
    const population = rest.population || 0;
    const giniLatest = rest.gini ? Object.values(rest.gini)[0] : null;

    // 2. Geography (Borders, Area, Region, Coords)
    const region = rest.region || "Unknown";
    const subRegion = rest.subregion || null;
    const areaKm2 = rest.area || 0;
    const borders = rest.borders || [];
    const coordinates = rest.latlng
      ? {
          type: "Point" as const,
          coordinates: [rest.latlng[1], rest.latlng[0]],
        } // [lng, lat]
      : null;

    // 3. Money Matters (Currencies, Daily Cost, Cash Culture)
    const currencyCode = Object.keys(rest.currencies || {})[0] || "USD";
    const currencyInfo = rest.currencies?.[currencyCode] || {
      name: "US Dollar",
      symbol: "$",
    };

    // 4. Logistics (IDD, Driving, Timezones)
    const logistics = {
      idd: rest.idd?.root
        ? `${rest.idd.root}${rest.idd.suffixes?.[0] || ""}`
        : null,
      car: rest.car
        ? {
            side: rest.car.side === "left" ? "left" : "right",
            signs: rest.car.signs || [],
          }
        : undefined,
      plugs: [], // To be enriched manually or via separate API
      voltage: null,
      timezones: rest.timezones || [],
      startOfWeek: rest.startOfWeek || "monday",
    };

    // 5. Build Final Object
    return {
      cca3,
      code: code2,
      name: rest.name.common || nameFallback,
      officialName: rest.name.official || rest.name.common || nameFallback,
      imageHeroUrl: rest.flags?.png || rest.flags?.svg || null,
      population,
      areaKm2,
      borders,
      region,
      subRegion,
      coords: (coordinates as any) || (Prisma.DbNull as any),
      languages,

      // Feature: Money Matters
      finance: {
        currency: {
          code: currencyCode,
          symbol: currencyInfo.symbol || "$",
          name: currencyInfo.name || "Currency",
        },
        giniIndex: giniLatest, // Handling Gini from latest year available
        avgDailyCost: {
          budget: 45, // Defaults for initial creation
          mid: 100,
          luxury: 250,
          currencyCode: "USD",
        },
        cashCulture: {
          tipping: "10%",
          atmAvailability: "High",
          primaryPayment: "Card/Cash",
        },
      },

      // Feature: Logistics
      logistics: logistics as any,

      // Initial defaults for UI stability
      safety: {
        overallScore: 4.0,
        soloFemaleFriendly: 4.0,
        crimeLevel: "Moderate",
        scams: [],
      },
      health: {
        tapWaterSafe: false,
        vaccines: [],
        medicalStandard: "Standard",
        medicalScore: 4,
      },
      seasons: {
        peakMonths: [],
        shoulderMonths: [],
        bestTimeDisplay: "Check local weather",
      },

      autoCreated: true,
      needsReview: true,
    };
  }
}
