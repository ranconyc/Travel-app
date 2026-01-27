import { useState, useEffect } from "react";
import { PlaceImagesService } from "@/services/place-images.service";

interface UsePlaceImagesOptions {
  place: any;
  limit?: number;
  enabled?: boolean;
}

interface UsePlaceImagesReturn {
  images: string[];
  heroImage: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage place images
 */
export function usePlaceImages({ 
  place, 
  limit = 5, 
  enabled = true 
}: UsePlaceImagesOptions): UsePlaceImagesReturn {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    if (!place || !enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const placeImages = await PlaceImagesService.getPlaceImages(place, limit);
      setImages(placeImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch images');
      console.error('Error fetching place images:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [place?.id, enabled]);

  const heroImage = images.length > 0 ? images[0] : null;

  return {
    images,
    heroImage,
    isLoading,
    error,
    refetch: fetchImages,
  };
}
