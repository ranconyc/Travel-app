import { City } from "@/domain/city/city.schema";
import {
  formatDistanceLabel,
  formatFlightTimeLabelFromDistance,
  getDistance,
} from "@/app/_utils/geo";
import BaseCard from "../BaseCard";
import DistanceBadge from "../../DistanceBadge";

type CityCardProps = {
  index: number;
  city: City;
  userLocation?: { lat: number; lng: number } | null;
  onDismiss?: (cityId: string) => void;
};

export default function CityCard({ city, userLocation, index }: CityCardProps) {
  const hasCoords = !!userLocation && !!city.coords?.coordinates?.length;

  const distance: number | null = hasCoords
    ? getDistance(
        userLocation!.lat,
        userLocation!.lng,
        city.coords!.coordinates[1],
        city.coords!.coordinates[0]
      )
    : null;

  const distanceLabel: string | null =
    distance !== null
      ? distance >= 3000
        ? formatFlightTimeLabelFromDistance(distance)
        : formatDistanceLabel(distance)
      : null;

  return (
    <BaseCard
      linkHref={`/city/${city.cityId}`}
      image={{ src: city?.imageHeroUrl, alt: city?.name }}
      priority={index < 3}
    >
      <div className="h-full flex items-end">
        <div>
          {distanceLabel && <DistanceBadge distanceLabel={distanceLabel} />}
          <h3 className="text-white font-bold leading-tight text-[clamp(14px,2.8vw,18px)] line-clamp-2">
            {city.name}
          </h3>
        </div>
      </div>
    </BaseCard>
  );
}
