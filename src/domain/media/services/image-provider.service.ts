/**
 * Unified Image Provider Service
 * Combines Unsplash (primary) and Pexels (fallback) APIs
 */

import { unsplashService } from './unsplash.service';
import { pexelsService } from './pexels.service';

interface ImageOptions {
  query: string;
  orientation?: 'landscape' | 'portrait' | 'square';
  category?: 'travel' | 'city' | 'nature' | 'architecture';
  entityType?: 'city' | 'place';
}

class ImageProviderService {
  /**
   * Get image with fallback logic
   * Tries Unsplash first, then Pexels if Unsplash fails
   */
  async getImage(options: ImageOptions): Promise<string | null> {
    const { query, orientation = 'landscape', category, entityType = 'place' } = options;
    const isDev = process.env.NODE_ENV !== 'production';

    if (isDev) console.log(`🔍 Searching for image: "${query}" (${entityType})`);

    // Try Unsplash first (primary provider)
    try {
      const unsplashImage = await unsplashService.getUnsplashImage({
        query,
        orientation: orientation === 'square' ? 'squarish' : orientation,
        category,
      });

      if (unsplashImage) {
        if (isDev) console.log(`✅ Found image via Unsplash: "${query}"`);
        return unsplashImage;
      }
    } catch (error) {
      console.warn(`⚠️ Unsplash failed for "${query}":`, error);
    }

    // Fallback to Pexels
    try {
      if (isDev) console.log(`🔄 Trying Pexels fallback for: "${query}"`);
      const pexelsImage = await pexelsService.getPexelsImage({
        query,
        orientation: orientation === 'square' ? 'square' : orientation,
      });

      if (pexelsImage) {
        if (isDev) console.log(`✅ Found image via Pexels fallback: "${query}"`);
        return pexelsImage;
      }
    } catch (error) {
      console.warn(`⚠️ Pexels fallback failed for "${query}":`, error);
    }

    if (isDev) console.log(`❌ No image found for: "${query}"`);
    return null;
  }

  /**
   * Get multiple images with fallback
   */
  async getImages(options: ImageOptions & { count?: number }): Promise<string[]> {
    const { query, count = 5, orientation = 'landscape', category } = options;
    const isDev = process.env.NODE_ENV !== 'production';

    // Try Unsplash first
    try {
      const unsplashImages = await unsplashService.getUnsplashImages({
        query,
        count,
        orientation: orientation === 'square' ? 'squarish' : orientation as any,
        category,
      });

      if (unsplashImages.length > 0) {
        if (isDev) console.log(`✅ Found ${unsplashImages.length} images via Unsplash: "${query}"`);
        return unsplashImages;
      }
    } catch (error) {
      console.warn(`⚠️ Unsplash batch failed for "${query}":`, error);
    }

    // Fallback to Pexels
    try {
      if (isDev) console.log(`🔄 Trying Pexels batch fallback for: "${query}"`);
      const pexelsImages = await pexelsService.getPexelsImages({
        query,
        per_page: count,
        orientation: orientation === 'square' ? 'square' : orientation,
      });

      if (pexelsImages.length > 0) {
        if (isDev) console.log(`✅ Found ${pexelsImages.length} images via Pexels fallback: "${query}"`);
        return pexelsImages;
      }
    } catch (error) {
      console.warn(`⚠️ Pexels batch fallback failed for "${query}":`, error);
    }

    if (isDev) console.log(`❌ No images found for: "${query}"`);
    return [];
  }

  /**
   * Get image with database caching
   */
  async getOrFetchImage(
    entityType: 'city' | 'place',
    entityId: string,
    query: string,
    options?: Partial<ImageOptions>
  ): Promise<string | null> {
    try {
      // TODO: Check if image exists in database first
      // const existingImage = await this.getImageFromDatabase(entityType, entityId);
      // if (existingImage) {
      //   console.log(`📁 Using cached image for ${entityType} ${entityId}`);
      //   return existingImage;
      // }

      // Fetch new image
      const imageUrl = await this.getImage({
        query,
        entityType,
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

  /**
   * Save image URL to database
   */
  private async saveImageToDatabase(
    entityType: 'city' | 'place',
    entityId: string,
    imageUrl: string,
    query: string
  ): Promise<boolean> {
    try {
      const isDev = process.env.NODE_ENV !== 'production';
      if (isDev) console.log(`💾 Saving image for ${entityType} ${entityId}:`, imageUrl);
      if (isDev) console.log(`📝 Query used: "${query}"`);
      
      // TODO: Implement actual database save based on your schema
      // if (entityType === 'city') {
      //   await prisma.city.update({
      //     where: { id: entityId },
      //     data: { imageHeroUrl: imageUrl }
      //   });
      // } else if (entityType === 'place') {
      //   await prisma.place.update({
      //     where: { id: entityId },
      //     data: { imageHeroUrl: imageUrl }
      //   });
      // }
      
      return true;
    } catch (error) {
      console.error('❌ Error saving image to database:', error);
      return false;
    }
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
export const imageProviderService = new ImageProviderService();

// Export helper function for easy usage
export async function getUnsplashImage(
  query: string, 
  options?: Partial<ImageOptions>
): Promise<string | null> {
  return imageProviderService.getImage({ query, ...options });
}
