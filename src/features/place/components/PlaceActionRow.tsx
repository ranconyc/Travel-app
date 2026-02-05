import React from "react";
import { Globe, Phone, MapPin, Navigation } from "lucide-react";
import Button from "@/components/atoms/Button";

interface PlaceActionRowProps {
  websiteUrl?: string | null;
  phoneNumber?: string | null;
  googlePlaceId?: string | null;
  coords?: {
    type: "Point";
    coordinates: number[]; // [lng, lat]
  };
}

export default function PlaceActionRow({
  websiteUrl,
  phoneNumber,
  googlePlaceId,
  coords,
}: PlaceActionRowProps) {
  // Generate Google Maps URL
  // Priority: 1. place_id (most accurate), 2. coords (fallback)
  let mapsUrl = "";
  if (googlePlaceId) {
    mapsUrl = `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${googlePlaceId}`;
  } else if (coords && coords.coordinates) {
    mapsUrl = `https://www.google.com/maps/search/?api=1&query=${coords.coordinates[1]},${coords.coordinates[0]}`;
  }

  // If no actions are available, filter them out
  const actions = [
    {
      label: "Website",
      icon: <Globe className="w-4 h-4 mr-2" />,
      href: websiteUrl,
      isExternal: true,
    },
    {
      label: "Call",
      icon: <Phone className="w-4 h-4 mr-2" />,
      href: phoneNumber ? `tel:${phoneNumber.replace(/\s+/g, "")}` : null,
      isExternal: true,
    },
    {
      label: "Directions",
      icon: <Navigation className="w-4 h-4 mr-2" />,
      href: mapsUrl || null,
      isExternal: true,
    },
  ].filter((action) => action.href);

  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href!}
          target={action.isExternal ? "_blank" : undefined}
          rel={action.isExternal ? "noopener noreferrer" : undefined}
          className="flex-1 sm:flex-none"
        >
          <Button
            variant="outline"
            className="w-full bg-surface-secondary/50 border-surface-secondary hover:bg-surface-hover hover:text-primary-500 transition-all font-semibold"
          >
            {action.icon}
            {action.label}
          </Button>
        </a>
      ))}
    </div>
  );
}
