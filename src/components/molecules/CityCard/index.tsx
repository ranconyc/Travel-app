"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import ImageWithFallback from "@/components/atoms/ImageWithFallback";
import Typography from "@/components/atoms/Typography/enhanced";
import { useState, useEffect } from "react";
import { getCityImage, getFallbackImage } from "@/utils/image-helpers";

interface CityCardProps {
  city: {
    id?: string;
    cityId: string;
    name: string;
    imageHeroUrl?: string | null;
    country?: {
      name?: string | null;
      code?: string | null;
    } | null;
    countryRefId?: string | null;
  };
  useUnsplash?: boolean; // Enable Unsplash API integration
}

export default function CityCard({ city, useUnsplash = true }: CityCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(
    city.imageHeroUrl || null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const countryName =
    city.country?.name || city.country?.code || city.countryRefId;

  // Fetch image from Unsplash if no image exists and Unsplash is enabled
  useEffect(() => {
    const fetchImage = async () => {
      if (!useUnsplash || imageUrl) return; // Don't fetch if disabled or image already exists

      setIsLoading(true);
      try {
        const unsplashImage = await getCityImage(
          city.name,
          countryName || undefined,
        );
        if (unsplashImage) {
          setImageUrl(unsplashImage);
        }
      } catch (error) {
        console.warn(`Failed to fetch image for ${city.name}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [city.name, countryName, useUnsplash, imageUrl]);

  return (
    <Link
      key={city.id}
      href={`/cities/${city.cityId}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-surface border border-surface-secondary shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        <ImageWithFallback
          src={imageUrl || ""}
          alt={city.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          fallback={
            <div className="w-full h-full bg-surface-secondary flex items-center justify-center">
              {isLoading ? (
                <div className="animate-pulse">
                  <MapPin className="text-secondary w-8 h-8 opacity-40" />
                </div>
              ) : (
                <MapPin className="text-secondary w-8 h-8 opacity-20" />
              )}
            </div>
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 p-3 w-full">
          <Typography
            variant="display-sm"
            color="inverse"
            className="leading-tight group-hover:text-brand transition-colors"
          >
            {city.name}
          </Typography>
          {countryName && (
            <div className="flex items-center gap-1 mt-1">
              <Typography
                variant="micro"
                color="inverse"
                className="opacity-70"
              >
                {countryName}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
