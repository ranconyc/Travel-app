/**
 * Image Helper Utilities
 * Secure server-side image fetching (API keys never exposed to client)
 */

import { serverImageService } from "@/domain/media/services/server-image.service";

/**
 * Get a single image for a city (server-side, secure)
 */
export async function getCityImage(
  cityName: string,
  countryName?: string,
  options?: {
    orientation?: "landscape" | "portrait" | "square";
  },
): Promise<string | null> {
  const query = countryName
    ? `${cityName} ${countryName} city skyline`
    : `${cityName} city skyline architecture`;

  const result = await serverImageService.getImage({
    query,
    category: "city",
    orientation: options?.orientation || "landscape",
    fallback: true, // Try Pexels if Unsplash fails
  });

  return result.imageUrl;
}

/**
 * Get a single image for a place/attraction (server-side, secure)
 */
export async function getPlaceImage(
  placeName: string,
  cityName?: string,
  options?: {
    orientation?: "landscape" | "portrait" | "square";
  },
): Promise<string | null> {
  const query = cityName
    ? `${placeName} ${cityName} landmark`
    : `${placeName} travel destination`;

  const result = await serverImageService.getImage({
    query,
    category: "travel",
    orientation: options?.orientation || "landscape",
    fallback: true,
  });

  return result.imageUrl;
}

/**
 * Get multiple images for discovery/popular places (server-side, secure)
 */
export async function getDiscoveryImages(
  query: string,
  count: number = 5,
): Promise<string[]> {
  const results = await serverImageService.getImages({
    query,
    count,
    category: "travel",
    fallback: true,
  });

  return results.map((r) => r.imageUrl).filter(Boolean) as string[];
}

/**
 * Get image with database caching (server-side, secure)
 */
export async function getOrFetchCityImage(
  cityId: string,
  cityName: string,
  countryName?: string,
): Promise<string | null> {
  const query = countryName
    ? `${cityName} ${countryName} city skyline`
    : `${cityName} city skyline architecture`;

  const result = await serverImageService.getImage({
    query,
    category: "city",
    fallback: true,
  });

  if (result.imageUrl) {
    // Optionally save to DB here in the future
  }

  return result.imageUrl;
}

/**
 * Get image with database caching (server-side, secure)
 */
export async function getOrFetchPlaceImage(
  placeId: string,
  placeName: string,
  cityName?: string,
): Promise<string | null> {
  const query = cityName
    ? `${placeName} ${cityName} landmark`
    : `${placeName} travel destination`;

  const result = await serverImageService.getImage({
    query,
    category: "travel",
    fallback: true,
  });

  if (result.imageUrl) {
    // Optionally save to DB here in the future
  }

  return result.imageUrl;
}

/**
 * Fallback image URLs for common scenarios
 */
export const FALLBACK_IMAGES = {
  city: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=800&h=600&fit=crop", // City skyline
  beach:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop", // Beach
  mountain:
    "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=800&h=600&fit=crop", // Mountain
  landmark:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop", // Landmark
  nature:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop", // Nature
  default:
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop", // Travel
};

/**
 * Get fallback image based on category
 */
export function getFallbackImage(
  category: keyof typeof FALLBACK_IMAGES = "default",
): string {
  return FALLBACK_IMAGES[category];
}
