import { StampStyle } from "@/components/molecules/CityStamp";
import {
  Plane,
  Building2,
  TreePalm,
  Mountain,
  Waves,
  Landmark,
  Music,
  Camera,
  Utensils,
  Coffee,
  Beer,
  Wine,
  Anchor,
  Sun,
  Moon,
  Star,
  Cloud,
  Rocket,
  Flag,
  MapPin,
  ShoppingBag,
  Briefcase,
  Gem,
  Flower2,
  Leaf,
  Palmtree,
  Ship,
  Train,
} from "lucide-react";
import React from "react";

interface CityStampConfig {
  variant: StampStyle;
  icon: React.ReactNode;
}

const DEFAULT_ICON = <MapPin size={14} />;

// Helper to create config easily
const cfg = (variant: StampStyle, icon: React.ReactNode): CityStampConfig => ({
  variant,
  icon,
});

export const CITY_STAMPS: Record<string, CityStampConfig> = {
  // Asia
  Bangkok: cfg("triangle-red", <TreePalm size={14} />), // Temples / Heat
  Tokyo: cfg("circle-double-red", <Building2 size={14} />), // Metropolis
  Singapore: cfg("hexagon", <Flower2 size={14} />), // Garden City
  Dubai: cfg("star-gold", <Building2 size={14} />), // Luxury / Architecture
  "Hong Kong": cfg("tech-rect-slate", <Ship size={14} />), // Harbor / Modern
  "Kuala Lumpur": cfg("pentagon-orange", <Building2 size={14} />),
  Istanbul: cfg("shield-red", <Landmark size={14} />), // History
  Delhi: cfg("octagon", <Landmark size={14} />),
  Antalya: cfg("ocean-shell-teal", <Waves size={14} />),
  Mumbai: cfg("detailed-octagon", <Train size={14} />), // Bustling
  Mecca: cfg("minimal-circle", <Star size={14} />),
  Phuket: cfg("ocean-wave-blue", <Waves size={14} />),
  Pattaya: cfg("wavy-circle", <Beer size={14} />),
  Seoul: cfg("tech-hex-cyan", <Music size={14} />), // K-Pop / Tech
  Osaka: cfg("circle-dashed-blue", <Utensils size={14} />), // Food

  // Europe
  London: cfg("circle", <Building2 size={14} />), // Classic
  Paris: cfg("minimal-rect", <Wine size={14} />), // Chic
  Rome: cfg("shield-gold", <Landmark size={14} />), // Empire
  Madrid: cfg("square", <Sun size={14} />),
  Barcelona: cfg("cross-emerald", <Building2 size={14} />), // Gaudi
  Amsterdam: cfg("rounded-rect", <Coffee size={14} />), // Canals/Coffee
  Berlin: cfg("minimal-square", <Beer size={14} />), // Industrial/Club
  Milan: cfg("diamond", <ShoppingBag size={14} />), // Fashion
  Vienna: cfg("oval-double-purple", <Music size={14} />), // Classical Music
  Prague: cfg("detailed-shield", <Landmark size={14} />),
  Venice: cfg("wavy-circle", <Ship size={14} />),
  Florence: cfg("ticket", <Camera size={14} />), // Art
  Dublin: cfg("heptagon-teal", <Beer size={14} />),

  // Americas
  "New York": cfg("rect-double-brown", <Building2 size={14} />),
  Miami: cfg("triangle-blue", <Palmtree size={14} />),
  "Los Angeles": cfg("star-blue", <Camera size={14} />), // Hollywood
  "Las Vegas": cfg("diamond", <Gem size={14} />), // Casino
  Orlando: cfg("cloud-sky", <Rocket size={14} />), // Parks/Space
  Toronto: cfg("nature-leaf-green", <Leaf size={14} />), // Maple Leaf
  Vancouver: cfg("trapezoid-cyan", <Mountain size={14} />),
  "Mexico City": cfg("pentagon-purple", <Sun size={14} />),
  Cancun: cfg("ocean-shell-teal", <Waves size={14} />),
  "Rio de Janeiro": cfg("oval", <Sun size={14} />),
  "Buenos Aires": cfg("retro-ticket-1", <Music size={14} />), // Tango

  // Others
  Cairo: cfg("triangle-red", <Landmark size={14} />), // Pyramids
  Sydney: cfg("ocean-wave-blue", <Waves size={14} />), // Opera House/Harbor
  Melbourne: cfg("rect-dashed-orange", <Coffee size={14} />),
  "Cape Town": cfg("trapezoid-cyan", <Mountain size={14} />),
  Johannesburg: cfg("rhombus-indigo", <Gem size={14} />),

  // Fallbacks for testing demo cities not in top list
  Germany: cfg("minimal-square", <Beer size={14} />),
  France: cfg("minimal-rect", <Wine size={14} />),
  USA: cfg("star-blue", <Flag size={14} />),
  UK: cfg("circle", <Building2 size={14} />),
  Thailand: cfg("triangle-red", <TreePalm size={14} />),
  Japan: cfg("circle-double-red", <Sun size={14} />),
};

export function getCityConfig(cityName: string): CityStampConfig {
  // Try exact match
  if (CITY_STAMPS[cityName]) {
    return CITY_STAMPS[cityName];
  }

  // Try hashing for variant if not found, but we need icons.
  // We'll return a predictable variant based on hash, and a default icon.
  const variants = [
    "circle",
    "oval",
    "hexagon",
    "diamond",
    "rounded-rect",
    "wavy-circle",
    "octagon",
    "square",
    "ticket",
    "badge",
    "triangle-red",
    "pentagon-orange",
    "shield-blue",
  ] as StampStyle[];

  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
    hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % variants.length;

  return {
    variant: variants[index],
    icon: DEFAULT_ICON,
  };
}
