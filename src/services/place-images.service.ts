import { Place } from "@/domain/place/place.schema";

/**
 * Service to get images for places using multiple strategies
 */
export class PlaceImagesService {
  
  /**
   * Get primary image for a place using fallback strategy
   */
  static async getPlaceImage(place: any): Promise<string> {
    // 1. If place already has imageHeroUrl, use it
    if (place.imageHeroUrl) {
      return place.imageHeroUrl;
    }

    // 2. Try to get from Google Places Photos API
    if (place.googlePlaceId) {
      try {
        const googlePhotos = await this.getGooglePlacePhotos(place.googlePlaceId);
        if (googlePhotos.length > 0) {
          return googlePhotos[0]; // Use first photo as hero
        }
      } catch (error) {
        console.warn('Failed to fetch Google photos:', error);
      }
    }

    // 3. Fallback to Unsplash based on place type and interests
    return this.getUnsplashImage(place);
  }

  /**
   * Get multiple images for a place
   */
  static async getPlaceImages(place: any, limit: number = 5): Promise<string[]> {
    const images: string[] = [];

    // Add hero image if exists
    if (place.imageHeroUrl) {
      images.push(place.imageHeroUrl);
    }

    // Try Google Places photos
    if (place.googlePlaceId) {
      try {
        const googlePhotos = await this.getGooglePlacePhotos(place.googlePlaceId);
        images.push(...googlePhotos.slice(0, limit - images.length));
      } catch (error) {
        console.warn('Failed to fetch Google photos:', error);
      }
    }

    // Fill remaining with Unsplash variations
    while (images.length < limit) {
      images.push(this.getUnsplashImage(place, images.length));
    }

    return images.slice(0, limit);
  }

  /**
   * Fetch photos from Google Places API
   */
  private static async getGooglePlacePhotos(placeId: string): Promise<string[]> {
    const API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!API_KEY) {
      console.warn('Google Places API key not configured, skipping Google photos');
      return [];
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?` +
        `place_id=${placeId}&` +
        `fields=photos&` +
        `key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.statusText}`);
      }

      const data = await response.json();
      const photos = data.result?.photos || [];

      return photos.map((photo: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?` +
        `maxwidth=800&` +
        `photoreference=${photo.photo_reference}&` +
        `key=${API_KEY}`
      );
    } catch (error) {
      console.error('Google Places photos error:', error);
      return [];
    }
  }

  /**
   * Generate Unsplash image URL based on place characteristics
   */
  private static getUnsplashImage(place: any, variation: number = 0): string {
    // Search terms based on place type
    const typeSearchTerms: Record<string, string> = {
      'RESTAURANT': 'restaurant food dining cuisine',
      'LANDMARK': 'landmark monument architecture travel',
      'MUSEUM': 'museum art gallery culture exhibition',
      'PARK': 'park nature outdoor garden',
      'SHOPPING_MALL': 'shopping mall retail store',
      'NIGHT_CLUB': 'nightclub bar entertainment',
      'CAFE': 'cafe coffee shop bistro',
      'HOTEL': 'hotel accommodation luxury',
      'BEACH': 'beach ocean sand travel',
      'TEMPLE': 'temple religious architecture spiritual',
    };

    // Search terms based on interests
    const interestSearchTerms: Record<string, string> = {
      'rooftop_bars': 'rooftop bar city skyline night',
      'street_food_markets': 'street food market local cuisine',
      'coworking_spaces': 'coworking office modern workspace',
      'fine_dining': 'fine dining restaurant elegant gourmet',
      'instagrammable_spots': 'instagrammable spot photogenic travel',
      'local_markets': 'local market traditional shopping',
      'art_galleries': 'art gallery museum exhibition',
      'nightlife': 'nightlife bar club entertainment',
      'nature': 'nature park outdoor landscape',
      'historical_sites': 'historical site monument architecture',
    };

    // Determine search query
    let searchQuery = place.name;
    
    // Try type-based search first
    if (place.type && typeSearchTerms[place.type]) {
      searchQuery = typeSearchTerms[place.type];
    }
    
    // Try interest-based search
    else if (place.tags && place.tags.length > 0) {
      const firstMatchingInterest = place.tags.find((tag: string) => interestSearchTerms[tag]);
      if (firstMatchingInterest) {
        searchQuery = interestSearchTerms[firstMatchingInterest];
      }
    }

    // Add variation for different images
    const variations = ['', 'beautiful', 'modern', 'traditional', 'popular'];
    const finalQuery = `${searchQuery} ${variations[variation % variations.length]}`.trim();

    return `https://source.unsplash.com/400x300/?${encodeURIComponent(finalQuery)}`;
  }

  /**
   * Simple fallback image generator for immediate use
   */
  static getFallbackImage(place: any): string {
    return this.getUnsplashImage(place);
  }
}
