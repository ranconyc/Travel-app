/**
 * Pexels API Service
 * Fallback image provider when Unsplash fails
 */

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

interface PexelsResponse {
  photos: PexelsPhoto[];
  total_results: number;
  next_page: string;
  prev_page: string | null;
}

interface PexelsImageOptions {
  query: string;
  orientation?: 'landscape' | 'portrait' | 'square';
  per_page?: number;
  color?: string;
}

class PexelsService {
  private readonly BASE_URL = 'https://api.pexels.com/v1';
  private readonly API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY || process.env.PEXELS_API_KEY;
  
  constructor() {
    if (!this.API_KEY) {
      console.warn('⚠️ Pexels API key not found. Please set PEXELS_API_KEY in your environment variables.');
    }
  }

  /**
   * Get a single high-quality image based on query
   */
  async getPexelsImage(options: PexelsImageOptions): Promise<string | null> {
    if (!this.API_KEY) {
      console.warn('⚠️ Pexels API key not configured');
      return null;
    }

    try {
      const { query, orientation = 'landscape', per_page = 1 } = options;
      
      const response = await fetch(
        `${this.BASE_URL}/search?` +
        new URLSearchParams({
          query,
          per_page: per_page.toString(),
          orientation,
          size: 'large', // Get large images
        }),
        {
          headers: {
            'Authorization': this.API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
      }

      const data: PexelsResponse = await response.json();
      
      if (data.photos.length === 0) {
        console.log(`📷 No Pexels images found for query: "${query}"`);
        return null;
      }

      const photo = data.photos[0];
      console.log(`📷 Found Pexels image for "${query}": ${photo.alt}`);
      
      // Use large size for backgrounds
      return photo.src.large;
      
    } catch (error) {
      console.error('❌ Error fetching Pexels image:', error);
      return null;
    }
  }

  /**
   * Get multiple images for a query
   */
  async getPexelsImages(options: PexelsImageOptions): Promise<string[]> {
    if (!this.API_KEY) {
      return [];
    }

    try {
      const { query, orientation = 'landscape', per_page = 5 } = options;
      
      const response = await fetch(
        `${this.BASE_URL}/search?` +
        new URLSearchParams({
          query,
          per_page: per_page.toString(),
          orientation,
          size: 'large',
        }),
        {
          headers: {
            'Authorization': this.API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
      }

      const data: PexelsResponse = await response.json();
      
      return data.photos.map(photo => photo.src.large);
      
    } catch (error) {
      console.error('❌ Error fetching Pexels images:', error);
      return [];
    }
  }
}

// Export singleton instance
export const pexelsService = new PexelsService();

// Export helper function for easy usage
export async function getPexelsImage(query: string, options?: Partial<PexelsImageOptions>): Promise<string | null> {
  return pexelsService.getPexelsImage({ query, ...options });
}
