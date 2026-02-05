import fs from "fs/promises";
import path from "path";
import {
  JsonCountry,
  JsonCitySearchResult,
} from "@/domain/city/city-data.types";

// Global cache to avoid re-reading 33MB file
let cachedData: JsonCountry[] | null = null;

async function getCountriesData(): Promise<JsonCountry[]> {
  if (cachedData) return cachedData;

  try {
    const filePath = path.join(
      process.cwd(),
      "src/data/countries+states+cities.json",
    );
    const fileContent = await fs.readFile(filePath, "utf-8");
    cachedData = JSON.parse(fileContent);
    return cachedData!;
  } catch (error) {
    console.error("Failed to load cities JSON:", error);
    return [];
  }
}

export class JsonCityService {
  /**
   * Search cities by name (case-insensitive) with scoring for relevance.
   */
  static async searchCities(
    query: string,
    limit = 50,
  ): Promise<JsonCitySearchResult[]> {
    if (!query || query.length < 2) return [];

    const countries = await getCountriesData();
    const normalizedQuery = query.toLowerCase().replace(/,/g, " ").trim();
    const queryTerms = normalizedQuery.split(/\s+/);
    const softCap = 200;

    // Scoring function
    const scoreCity = (
      cityName: string,
      stateName: string | null,
      stateCode: string | null,
      countryPopulation: number,
    ): number => {
      let score = 0;
      const lowerName = cityName.toLowerCase();
      const lowerState = stateName?.toLowerCase() ?? "";
      const lowerStateCode = stateCode?.toLowerCase() ?? "";
      const primaryTerm = queryTerms[0];

      // 1. Basic Name Match (on first term)
      if (lowerName === primaryTerm) {
        score += 1000;
      } else if (lowerName.startsWith(primaryTerm)) {
        score += 500;
      } else {
        score += 100;
      }

      // 2. Multi-term logic (e.g. "Dallas TX" or "Paris France")
      if (queryTerms.length > 1) {
        const remainingTerms = queryTerms.slice(1);
        const matchesState = remainingTerms.some(
          (t) => (lowerState && lowerState.includes(t)) || lowerStateCode === t,
        );
        if (matchesState) {
          score += 2000; // Heavy boost for city + state matches
        }
      }

      // 3. Country population influence (log scale)
      score += Math.log10(countryPopulation + 1) * 10;

      return score;
    };

    // Collect matches
    const results: (JsonCitySearchResult & { score: number })[] = [];

    for (const country of countries) {
      if (!country.states) continue;

      for (const state of country.states) {
        const lowerState = state.name?.toLowerCase() ?? "";
        const lowerStateCode = state.iso2?.toLowerCase() ?? "";

        if (!state.cities) continue;

        for (const city of state.cities) {
          const lowerCity = city.name.toLowerCase();

          // Match Logic:
          // - Single term: standard include
          // - Multi term: first term matches city AND at least one other term matches state
          //   OR the city name includes the full normalized query string.
          let isMatch = false;
          if (queryTerms.length === 1) {
            isMatch = lowerCity.includes(queryTerms[0]);
          } else {
            const firstTermMatches = lowerCity.includes(queryTerms[0]);
            const otherTermsMatchState = queryTerms
              .slice(1)
              .some((t) => lowerState.includes(t) || lowerStateCode === t);
            const fullQueryMatchesCity = lowerCity.includes(normalizedQuery);
            isMatch =
              (firstTermMatches && otherTermsMatchState) ||
              fullQueryMatchesCity;
          }

          if (isMatch) {
            const countryPop = country?.population ?? 0;
            results.push({
              id: city.id,
              name: city.name,
              stateName: state.name || "",
              stateCode: state.iso2 || "",
              stateType: state.type,
              countryName: country.name,
              countryCode: country.iso2,
              latitude: parseFloat(city.latitude),
              longitude: parseFloat(city.longitude),
              timezone: city.timezone,
              countryPopulation: countryPop,
              emoji: country.emoji,
              score: scoreCity(city.name, state.name, state.iso2, countryPop),
            });

            // Stop collecting if we hit soft cap
            if (results.length >= softCap) {
              break;
            }
          }
        }
        if (results.length >= softCap) break;
      }
      if (results.length >= softCap) break;
    }

    // Sort by score descending, then slice to limit
    results.sort((a, b) => b.score - a.score);

    // Return sliced top results
    return results.slice(0, limit).map(({ score: _score, ...rest }) => rest);
  }

  /**
   * Find nearest cities using Haversine formula
   */
  static async findNearestCities(
    lat: number,
    lng: number,
    limit = 10,
    maxDistanceKm = 500,
  ): Promise<(JsonCitySearchResult & { distance: number })[]> {
    const countries = await getCountriesData();
    const citiesWithDist: (JsonCitySearchResult & { distance: number })[] = [];

    // Basic validity check
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return [];

    const R = 6371; // Radius of the earth in km
    const toRad = Math.PI / 180;

    for (const country of countries) {
      for (const state of country.states) {
        for (const city of state.cities) {
          const cLat = parseFloat(city.latitude);
          const cLng = parseFloat(city.longitude);

          if (isNaN(cLat) || isNaN(cLng)) continue;

          // Optimization: Skip if rough lat/lng diff is too large (> ~5 deg is definitely > 500km)
          if (Math.abs(cLat - lat) > 5 || Math.abs(cLng - lng) > 5) continue;

          // Haversine
          const dLat = (cLat - lat) * toRad;
          const dLon = (cLng - lng) * toRad;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat * toRad) *
              Math.cos(cLat * toRad) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const d = R * c;

          if (d <= maxDistanceKm) {
            citiesWithDist.push({
              id: city.id,
              name: city.name,
              stateName: state.name,
              stateCode: state.iso2,
              stateType: state.type,
              countryName: country.name,
              countryCode: country.iso2,
              latitude: cLat,
              longitude: cLng,
              timezone: city.timezone,
              distance: d,
              countryPopulation: country?.population ?? 0,
            });
          }
        }
      }
    }

    // Sort by distance and slice
    return citiesWithDist
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }

  /**
   * Get formatted city details by ID
   */
  static async getCityById(id: number): Promise<JsonCitySearchResult | null> {
    const countries = await getCountriesData();

    for (const country of countries) {
      for (const state of country.states) {
        for (const city of state.cities) {
          if (city.id === id) {
            return {
              id: city.id,
              name: city.name,
              stateName: state.name,
              stateCode: state.iso2,
              stateType: state.type,
              countryName: country.name,
              countryCode: country.iso2,
              latitude: parseFloat(city.latitude),
              longitude: parseFloat(city.longitude),
              timezone: city.timezone,
              countryPopulation: country?.population ?? 0,
              wikiDataId: city.wikiDataId,
            };
          }
        }
      }
    }
    return null;
  }
}
