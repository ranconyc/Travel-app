/**
 * City Creation Service with Google Places Integration
 * Fetches Google Place IDs only during individual city creation to save costs
 */

import { prisma } from "@/lib/db/prisma";
import { generateCitySlug, generateUniqueSlug } from "@/lib/utils/slug";
import { getCountryForCity, isMajorCapital } from "@/lib/utils/countryMapping";
import { Client } from "@googlemaps/google-maps-services-js";

export interface CreateCityData {
  name: string;
  countryName?: string;
  coords?: { lat: number; lng: number };
  additionalData?: Partial<{
    population: number;
    timeZone: string;
    imageHeroUrl: string;
    bestSeason: string;
    idealDuration: string;
    safety: string;
    budget: any;
    gettingAround: any;
  }>;
}

export class CityCreationService {
  private googleMapsClient: Client;

  constructor() {
    this.googleMapsClient = new Client({});
  }

  /**
   * Create a new city with Google Place ID fetching
   * This is the cost-effective approach - only fetches Google Place ID when needed
   */
  async createCity(data: CreateCityData) {
    const { name, countryName, coords, additionalData } = data;
    
    // Determine country
    const resolvedCountryName = countryName || getCountryForCity(name);
    const isCapital = isMajorCapital(name);
    const priority = isCapital ? 100 : 80;

    // Get existing slugs to ensure uniqueness
    const existingCities = await prisma.city.findMany({
      select: { cityId: true } as any
    });
    const existingSlugs = existingCities.map((c: any) => c.cityId).filter(Boolean);

    // Generate unique slug
    const baseSlug = generateCitySlug(resolvedCountryName, name);
    const slug = generateUniqueSlug(baseSlug, existingSlugs);

    // Prepare city data
    const cityData: any = {
      cityId: slug,
      name,
      slug,
      isVerified: true,
      priority,
      isCapital,
      countryRefId: null, // Will be populated when country relations are established
      autoCreated: false,
      needsReview: false,
      googlePlaceId: null,
      ...additionalData,
    };

    // Add coordinates if provided
    if (coords) {
      cityData.coords = {
        type: "Point",
        coordinates: [coords.lng, coords.lat]
      };
    }

    // Fetch Google Place ID (cost-effective - only when creating individual cities)
    if (process.env.GOOGLE_MAPS_API_KEY) {
      try {
        console.log(`🔍 Fetching Google Place ID for ${name}...`);
        const response = await this.googleMapsClient.findPlaceFromText({
          params: {
            input: `${name}, ${resolvedCountryName}`,
            inputtype: 'textquery' as any,
            fields: ['place_id'],
            key: process.env.GOOGLE_MAPS_API_KEY,
          },
        });

        if (response.data.candidates && response.data.candidates.length > 0) {
          cityData.googlePlaceId = response.data.candidates[0].place_id;
          console.log(`✅ Found Google Place ID for ${name}: ${cityData.googlePlaceId}`);
        } else {
          console.warn(`⚠️  No Google Place found for ${name}, ${resolvedCountryName}`);
        }
      } catch (error) {
        console.warn(`⚠️  Google Places API failed for ${name}:`, error);
      }
    } else {
      console.warn(`⚠️  GOOGLE_MAPS_API_KEY not configured. Skipping Google Place ID for ${name}`);
    }

    // Create city
    const city = await prisma.city.create({
      data: cityData,
    });

    console.log(`🎉 Successfully created city: ${name} (${slug})`);
    return city;
  }

  /**
   * Update existing city with Google Place ID
   * Useful for bulk operations where you want to add Google Place IDs later
   */
  async updateCityWithGooglePlaceId(cityId: string) {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error("GOOGLE_MAPS_API_KEY not configured");
    }

    const city = await prisma.city.findUnique({
      where: { cityId }
    }) as any;

    if (!city) {
      throw new Error(`City not found: ${cityId}`);
    }

    if (city.googlePlaceId) {
      console.log(`ℹ️  City ${city.name} already has Google Place ID: ${city.googlePlaceId}`);
      return city;
    }

    const countryName = getCountryForCity(city.name);

    try {
      const response = await this.googleMapsClient.findPlaceFromText({
        params: {
          input: `${city.name}, ${countryName}`,
          inputtype: 'textquery' as any,
          fields: ['place_id'],
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      if (response.data.candidates && response.data.candidates.length > 0) {
        const googlePlaceId = response.data.candidates[0].place_id;
        
        const updatedCity = await prisma.city.update({
          where: { cityId },
          data: { googlePlaceId } as any
        });

        console.log(`✅ Updated ${city.name} with Google Place ID: ${googlePlaceId}`);
        return updatedCity;
      } else {
        console.warn(`⚠️  No Google Place found for ${city.name}, ${countryName}`);
        return city;
      }
    } catch (error) {
      console.error(`❌ Failed to fetch Google Place ID for ${city.name}:`, error);
      throw error;
    }
  }

  /**
   * Batch update multiple cities with Google Place IDs
   * Use this carefully as it will incur API costs
   */
  async batchUpdateGooglePlaceIds(cityIds: string[]) {
    console.log(`🔄 Starting batch update for ${cityIds.length} cities...`);
    
    const results = {
      success: 0,
      failed: 0,
      skipped: 0
    };

    for (const cityId of cityIds) {
      try {
        await this.updateCityWithGooglePlaceId(cityId);
        results.success++;
      } catch (error) {
        console.error(`❌ Failed to update ${cityId}:`, error);
        results.failed++;
      }
    }

    console.log(`🎉 Batch update completed: ${results.success} success, ${results.failed} failed, ${results.skipped} skipped`);
    return results;
  }
}
