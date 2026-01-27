/**
 * Unsplash API Service
 * Primary image provider for Cities and Places
 */

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  description: string;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

interface UnsplashResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

interface UnsplashImageOptions {
  query: string;
  orientation?: 'landscape' | 'portrait' | 'squarish';
  count?: number;
  category?: 'travel' | 'city' | 'nature' | 'architecture';
}

class UnsplashService {
  private readonly BASE_URL = 'https://api.unsplash.com';
  private readonly ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_ACCESS_KEY;
  
  constructor() {
    if (!this.ACCESS_KEY) {
      console.warn('⚠️ Unsplash API key not found. Please set UNSPLASH_ACCESS_KEY in your environment variables.');
    }
  }

  /**
   * Get a single high-quality image based on query
   */
  async getUnsplashImage(options: UnsplashImageOptions): Promise<string | null> {
    if (!this.ACCESS_KEY) {
      console.warn('⚠️ Unsplash API key not configured');
      return null;
    }

    try {
      const { query, orientation = 'landscape', category } = options;
      
      // Build search query with category for better results
      const searchQuery = category ? `${query} ${category}` : query;
      
      const response = await fetch(
        `${this.BASE_URL}/search/photos?` +
        new URLSearchParams({
          query: searchQuery,
          per_page: '1',
          orientation,
          content_filter: 'high', // Only high-quality photos
          order_by: 'relevant', // Most relevant first
        }),
        {
          headers: {
            'Authorization': `Client-ID ${this.ACCESS_KEY}`,
            'Accept-Version': 'v1',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
      }

      const data: UnsplashResponse = await response.json();
      
      if (data.results.length === 0) {
        console.log(`📷 No images found for query: "${searchQuery}"`);
        return null;
      }

      const photo = data.results[0];
      console.log(`📷 Found Unsplash image for "${searchQuery}": ${photo.description}`);
      
      // Return regular size (good for backgrounds)
      return photo.urls.regular;
      
    } catch (error) {
      console.error('❌ Error fetching Unsplash image:', error);
      return null;
    }
  }

  /**
   * Get multiple images for a query
   */
  async getUnsplashImages(options: UnsplashImageOptions): Promise<string[]> {
    if (!this.ACCESS_KEY) {
      return [];
    }

    try {
      const { query, orientation = 'landscape', count = 5, category } = options;
      
      const searchQuery = category ? `${query} ${category}` : query;
      
      const response = await fetch(
        `${this.BASE_URL}/search/photos?` +
        new URLSearchParams({
          query: searchQuery,
          per_page: count.toString(),
          orientation,
          content_filter: 'high',
          order_by: 'relevant',
        }),
        {
          headers: {
            'Authorization': `Client-ID ${this.ACCESS_KEY}`,
            'Accept-Version': 'v1',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
      }

      const data: UnsplashResponse = await response.json();
      
      return data.results.map(photo => photo.urls.regular);
      
    } catch (error) {
      console.error('❌ Error fetching Unsplash images:', error);
      return [];
    }
  }

  /**
   * Download and save image URL to database
   */
  async saveImageToDatabase(
    entityType: 'city' | 'place',
    entityId: string,
    imageUrl: string,
    query: string
  ): Promise<boolean> {
    try {
      // This would be implemented based on your database schema
      // For now, we'll just log the action
      console.log(`💾 Saving image for ${entityType} ${entityId}:`, imageUrl);
      console.log(`📝 Query used: "${query}"`);
      
      // TODO: Implement actual database save
      // await prisma.city.update({
      //   where: { id: entityId },
      //   data: { imageHeroUrl: imageUrl }
      // });
      
      return true;
    } catch (error) {
      console.error('❌ Error saving image to database:', error);
      return false;
    }
  }

  /**
   * Get image with database caching
   */
  async getOrFetchImage(
    entityType: 'city' | 'place',
    entityId: string,
    query: string,
    options?: Partial<UnsplashImageOptions>
  ): Promise<string | null> {
    try {
      // TODO: Check if image exists in database first
      // const existingImage = await prisma.city.findUnique({
      //   where: { id: entityId },
      //   select: { imageHeroUrl: true }
      // });
      
      // if (existingImage?.imageHeroUrl) {
      //   return existingImage.imageHeroUrl;
      // }

      // Fetch new image from Unsplash
      const imageUrl = await this.getUnsplashImage({
        query,
        category: entityType === 'city' ? 'city' : 'travel',
        ...options,
      });

      if (imageUrl) {
        // Save to database for future use
        await this.saveImageToDatabase(entityType, entityId, imageUrl, query);
        return imageUrl;
      }

      return null;
      
    } catch (error) {
      console.error('❌ Error in getOrFetchImage:', error);
      return null;
    }
  }
}

// Export singleton instance
export const unsplashService = new UnsplashService();

// Export helper function for easy usage
export async function getUnsplashImage(query: string, options?: Partial<UnsplashImageOptions>): Promise<string | null> {
  return unsplashService.getUnsplashImage({ query, ...options });
}
