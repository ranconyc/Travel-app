import { City } from "@/domain/city/city.schema";
import { Country } from "@/domain/country/country.schema";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CitiesSection({ country }: { country: any }) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold font-sora">Popular Cities</h3>
        {country.cities && country.cities.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {country.cities.slice(0, 5).map((city: City) => (
              <Link
                href={`/cities/${city.cityId}`}
                key={city.cityId}
                className="min-w-[140px] w-[140px] flex-shrink-0 relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800 group shadow-lg"
              >
                {city.media?.[0] || city.imageHeroUrl ? (
                  <Image
                    src={city.media?.[0] || city.imageHeroUrl}
                    alt={city.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <MapPin className="text-gray-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-4">
                  <span className="font-bold text-white text-md leading-tight">
                    {city.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-surface/30 rounded-2xl border border-dashed border-surface-secondary">
            <MapPin className="w-8 h-8 mx-auto text-secondary mb-2 opacity-50" />
            <p className="text-secondary italic text-sm">
              Explore cities coming soon
            </p>
          </div>
        )}
      </div>
    </>
  );
}
