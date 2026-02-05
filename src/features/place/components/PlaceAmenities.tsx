import React from "react";
import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";
import {
  Wifi,
  Wind, // AC?
  Car, // Parking
  Accessibility, // Wheelchair
  Baby, // Family friendly
  Utensils,
  CreditCard,
  Music,
  Trees,
  Laptop,
  CheckCircle2,
} from "lucide-react";

interface PlaceAmenitiesProps {
  amenities: string[];
  accessibility?: string | null;
}

// Map common amenity strings to Lucide icons
const getAmenityIcon = (amenity: string) => {
  const normalized = amenity.toLowerCase();
  if (normalized.includes("wifi")) return Wifi;
  if (normalized.includes("air condition") || normalized.includes("ac"))
    return Wind;
  if (normalized.includes("parking")) return Car;
  if (normalized.includes("wheelchair") || normalized.includes("access"))
    return Accessibility;
  if (normalized.includes("family") || normalized.includes("kid")) return Baby;
  if (normalized.includes("food") || normalized.includes("dining"))
    return Utensils;
  if (normalized.includes("card") || normalized.includes("payment"))
    return CreditCard;
  if (normalized.includes("music") || normalized.includes("live")) return Music;
  if (normalized.includes("outdoor") || normalized.includes("garden"))
    return Trees;
  if (normalized.includes("work") || normalized.includes("laptop"))
    return Laptop;

  return CheckCircle2; // Fallback
};

export default function PlaceAmenities({
  amenities,
  accessibility,
}: PlaceAmenitiesProps) {
  if ((!amenities || amenities.length === 0) && !accessibility) return null;

  return (
    <Block>
      <Typography
        variant="h3"
        className="text-upheader font-bold text-secondary uppercase tracking-wider mb-6"
      >
        Amenities & Features
      </Typography>

      {amenities && amenities.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {amenities.map((amenity) => {
            const Icon = getAmenityIcon(amenity);
            return (
              <div
                key={amenity}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary/30 border border-surface-secondary/50"
              >
                <Icon className="w-5 h-5 text-primary-500" />
                <span className="text-sm font-medium text-txt-secondary capitalize">
                  {amenity.replace(/-/g, " ")}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {accessibility && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
          <Accessibility className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <span className="block text-sm font-bold text-txt-main mb-1">
              Accessibility
            </span>
            <span className="text-sm text-txt-secondary leading-relaxed">
              {accessibility}
            </span>
          </div>
        </div>
      )}
    </Block>
  );
}
