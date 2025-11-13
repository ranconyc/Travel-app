import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "../Button";
import { City } from "@/domain/city/city.schema";
import { getDistance } from "@/app/_utils/geo";

type CityCardProps = {
  city: City;
  userLocation?: { lat: number; lng: number } | null;
  onDismiss?: (cityId: string) => void;
};

export default function CityCard({ city, userLocation }: CityCardProps) {
  const distanceLabel =
    city.coords && userLocation
      ? `${getDistance(
          userLocation.lat,
          userLocation.lng,
          city.coords.coordinates[1],
          city.coords.coordinates[0]
        ).toFixed()} km away`
      : null;

  return (
    <Link href={`/city/${city.cityId}`} className="block">
      <div className="bg-white rounded-2xl overflow-hidden min-w-[240px] h-[300px] mx-auto shadow">
        <div className="relative h-full">
          <Image
            src={
              city.imageHeroUrl ||
              "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=2039"
            }
            alt={city.name}
            fill
            sizes="(max-width: 768px) 80vw, 240px"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/60" />

          <div className="absolute bottom-0 left-0 right-0 p-3">
            {distanceLabel && (
              <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs w-fit mb-2">
                {distanceLabel}
              </div>
            )}

            <h3 className="text-white font-bold leading-tight text-[clamp(14px,2.8vw,18px)] line-clamp-2">
              {city.name}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}
