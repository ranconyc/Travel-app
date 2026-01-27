"use client";

import Link from "next/link";
import ImageWithFallback from "@/components/atoms/ImageWithFallback";
import Typography from "@/components/atoms/Typography/enhanced";
import { useState, useEffect } from "react";

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
}

export default function CityCard({ city }: CityCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(city.imageHeroUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  
  const countryName = city.country?.name || city.country?.code || city.countryRefId;

  useEffect(() => {
    // If we don't have an image, try to fetch one from Unsplash
    if (!city.imageHeroUrl && !isLoading) {
      setIsLoading(true);
      
      const fetchCityImage = async () => {
        try {
          const response = await fetch('/api/images?query=' + encodeURIComponent(`${city.name}, ${countryName}`));
          const data = await response.json();
          
          if (data.success && data.imageUrl) {
            setImageUrl(data.imageUrl);
          }
        } catch (error) {
          console.error('Failed to fetch city image:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCityImage();
    }
  }, [city.imageHeroUrl, city.name, countryName, isLoading]);

  return (
    <Link
      key={city.id}
      href={`/cities/${city.cityId}`}
      className="group block min-w-[232px]"
    >
      <div className="relative group border-0 shadow-sm overflow-hidden rounded-2xl bg-surface aspect-4/3">
        <ImageWithFallback
          src={imageUrl || ""}
          alt={city.name}
          fill
          fallbackText={city.name.substring(0, 2).toUpperCase()}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
          {countryName && (
            <Typography
              variant="micro"
              className="text-white/80 mb-0.5"
            >
              {countryName}
            </Typography>
          )}
          <Typography
            variant="h3"
            className="text-white truncate leading-tight group-hover:text-brand transition-colors"
          >
            {city.name}
          </Typography>
        </div>

        {/* Hover Glow / Bottom Bar */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-brand transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </div>
    </Link>
  );
}
