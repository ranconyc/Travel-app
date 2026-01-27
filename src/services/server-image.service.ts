/**
 * Server-Side Image Service
 * Secure API calls that never expose keys to client
 */

interface ServerImageOptions {
  query: string;
  orientation?: 'landscape' | 'portrait' | 'square';
  category?: 'travel' | 'city' | 'nature' | 'architecture';
  fallback?: boolean; // Try Pexels if Unsplash fails
}

interface ServerImageResult {
  imageUrl: string | null;
  description?: string;
  photographer?: string;
  photographerUrl?: string;
  attribution?: string;
  source?: 'unsplash' | 'pexels';
  error?: string;
}

class ServerImageService {
  private readonly baseUrl: string;

  constructor() {
    // Use the current request URL for API calls
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }

  /**
   * Get image from server-side API (secure)
   */
  async getImage(options: ServerImageOptions): Promise<ServerImageResult> {
    const { query, orientation = 'landscape', category = 'travel', fallback = true } = options;

    try {
      // Try Unsplash first
      const unsplashResponse = await fetch(
        `${this.baseUrl}/api/images/unsplash?` +
        new URLSearchParams({
          query,
          orientation,
          category,
        }),
        { 
          next: { revalidate: 3600 }, // Cache for 1 hour
          cache: 'force-cache' // Use cache when possible
        }
      );

      if (unsplashResponse.ok) {
        const data = await unsplashResponse.json();
        if (data.imageUrl) {
          console.log(`✅ Found image via Unsplash: "${query}"`);
          return {
            ...data,
            source: 'unsplash'
          };
        }
      }

      // Fallback to Pexels if enabled
      if (fallback) {
        console.log(`🔄 Trying Pexels fallback for: "${query}"`);
        const pexelsResponse = await fetch(
          `${this.baseUrl}/api/images/pexels?` +
          new URLSearchParams({
            query,
            orientation,
          }),
          { 
            next: { revalidate: 3600 },
            cache: 'force-cache'
          }
        );

        if (pexelsResponse.ok) {
          const data = await pexelsResponse.json();
          if (data.imageUrl) {
            console.log(`✅ Found image via Pexels fallback: "${query}"`);
            return {
              ...data,
              source: 'pexels'
            };
          }
        }
      }

      console.log(`❌ No image found for: "${query}"`);
      return {
        imageUrl: null,
        error: 'No images found'
      };

    } catch (error) {
      console.error(`❌ Error fetching image for "${query}":`, error);
      return {
        imageUrl: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get multiple images
   */
  async getImages(options: ServerImageOptions & { count?: number }): Promise<ServerImageResult[]> {
    const { count = 5, ...imageOptions } = options;
    const results: ServerImageResult[] = [];

    for (let i = 0; i < count; i++) {
      const result = await this.getImage(imageOptions);
      if (result.imageUrl) {
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Generate optimized query for better image results
   */
  generateOptimizedQuery(
    name: string,
    entityType: 'city' | 'place',
    country?: string
  ): string {
    const baseName = name.trim();
    
    if (entityType === 'city') {
      // For cities, try city name + country for better results
      if (country && country !== baseName) {
        return `${baseName} ${country} city skyline`;
      }
      return `${baseName} city skyline architecture`;
    }
    
    // For places, use place name + travel keywords
    return `${baseName} travel destination landmark`;
  }
}

// Export singleton instance
export const serverImageService = new ServerImageService();

// Export helper function for easy usage
export async function getServerImage(
  query: string, 
  options?: Partial<ServerImageOptions>
): Promise<ServerImageResult> {
  return serverImageService.getImage({ query, ...options });
}
