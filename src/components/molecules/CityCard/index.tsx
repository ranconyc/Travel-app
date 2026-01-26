import Link from "next/link";
import { MapPin } from "lucide-react";
import ImageWithFallback from "@/components/atoms/ImageWithFallback";
import Typography from "@/components/atoms/Typography";

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
  const countryName =
    city.country?.name || city.country?.code || city.countryRefId;
  return (
    <Link
      key={city.id}
      href={`/cities/${city.cityId}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-surface border border-surface-secondary shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        <ImageWithFallback
          src={city.imageHeroUrl || ""}
          alt={city.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          fallback={
            <div className="w-full h-full bg-surface-secondary flex items-center justify-center">
              <MapPin className="text-secondary w-8 h-8 opacity-20" />
            </div>
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 p-3 w-full">
          <Typography
            variant="h2"
            className="text-white font-bold text-lg leading-tight group-hover:text-brand transition-colors"
          >
            {city.name}
          </Typography>
          {countryName && (
            <div className="flex items-center gap-1 mt-1">
              <Typography
                variant="tiny"
                className="text-white/70 text-micro uppercase tracking-wider font-medium"
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
