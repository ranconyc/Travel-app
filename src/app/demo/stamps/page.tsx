import React from "react";
import {
  Plane,
  Anchor,
  Mountain,
  Building2,
  TreePalm,
  Camera,
  Utensils,
  Music,
  Waves,
  Sun,
  MapPin,
  Flag,
  Coffee,
  Beer,
  Wine,
  Star,
} from "lucide-react";

// 1. Define strict types for better DX (Developer Experience)
type StampVariant = "circle" | "rounded";
export const BORDER_STYLES = [
  "solid",
  "dashed",
  "dotted",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset",
  // "none",
  // "hidden",
] as const;

export const STAMP_COLORS = [
  // Classic Postal Colors
  "#C80E0E",
  "#1E40AF",
  "#166534",
  "#1E1B4B",
  "#7F1D1D",
  "#3730A3",
  "#065F46",
  "#854D0E",
  "#581C87",
  "#0F172A",

  // Modern & Travel Tones
  "#991B1B",
  "#1E3A8A",
  "#064E3B",
  "#431407",
  "#4C1D95",
  "#BE185D",
  "#0369A1",
  "#15803D",
  "#A21CAF",
  "#334155",

  // Earthy & Vintage
  "#7C2D12",
  "#312E81",
  "#065F46",
  "#78350F",
  "#4A044E",
  "#92400E",
  "#111827",
  "#1E293B",
  "#3F6212",
  "#701A75",
];

// 2. The TypeScript Type (for your component props)
export type BorderStyle = (typeof BORDER_STYLES)[number];

interface StampProps {
  city: string;
  country: string;
  date?: string;
  variant?: StampVariant;
  border?: BorderStyle;
  color?: string;
  icon?: React.ReactNode;
}

const Stamp = ({
  city,
  country,
  date,
  variant = "rounded",
  border = "solid",
  color = "#c80e0e", // Default red
  icon,
}: StampProps) => {
  // Determine border radius class
  const radiusClass =
    variant === "circle"
      ? "rounded-full aspect-square flex items-center justify-center"
      : "rounded-xl";

  return (
    <div
      className={`p-1 h-fit border-2 ${radiusClass} transition-transform hover:scale-105`}
      style={{ borderColor: color, borderStyle: border }}
    >
      <div
        className={`border-4 p-4 min-w-[140px] flex flex-col items-center justify-center gap-1 ${radiusClass}`}
        style={{ borderColor: color, borderStyle: border, color: color }}
      >
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
          {country}
        </span>

        <h1 className="text-xl font-black uppercase leading-none tracking-tighter">
          {city}
        </h1>

        {/* {icon && <div className="my-1">{icon}</div>} */}
        {date && (
          <p
            className="text-[10px] font-mono font-bold border-t mt-1 pt-1"
            style={{ borderTopColor: color }}
          >
            {date}
          </p>
        )}
      </div>
    </div>
  );
};

export default function StampDemoPage() {
  const DEMO_CITIES = [
    {
      name: "Hong Kong",
      country: "China",
      icon: <Building2 size={18} />,
      color: "#1E1B4B",
    },
    {
      name: "Bangkok",
      country: "Thailand",
      icon: <TreePalm size={18} />,
      color: "#065F46",
    },
    {
      name: "London",
      country: "UK",
      icon: <Flag size={18} />,
      color: "#1E40AF",
    },
    {
      name: "Singapore",
      country: "Singapore",
      icon: <Building2 size={18} />,
      color: "#C80E0E",
    },
    {
      name: "Macau",
      country: "China",
      icon: <Star size={18} />,
      color: "#854D0E",
    },
    {
      name: "Paris",
      country: "France",
      icon: <Camera size={18} />,
      color: "#7F1D1D",
    },
    {
      name: "Dubai",
      country: "UAE",
      icon: <Sun size={18} />,
      color: "#92400E",
    },
    {
      name: "New York",
      country: "USA",
      icon: <Building2 size={18} />,
      color: "#0F172A",
    },
    {
      name: "Kuala Lumpur",
      country: "Malaysia",
      icon: <Plane size={18} />,
      color: "#3730A3",
    },
    {
      name: "Istanbul",
      country: "Turkey",
      icon: <MapPin size={18} />,
      color: "#7C2D12",
    },
    {
      name: "Delhi",
      country: "India",
      icon: <Sun size={18} />,
      color: "#B45309",
    },
    {
      name: "Antalya",
      country: "Turkey",
      icon: <Waves size={18} />,
      color: "#0369A1",
    },
    {
      name: "Shenzhen",
      country: "China",
      icon: <Building2 size={18} />,
      color: "#334155",
    },
    {
      name: "Mumbai",
      country: "India",
      icon: <Star size={18} />,
      color: "#1E293B",
    },
    {
      name: "Phuket",
      country: "Thailand",
      icon: <TreePalm size={18} />,
      color: "#15803D",
    },
    {
      name: "Rome",
      country: "Italy",
      icon: <Camera size={18} />,
      color: "#991B1B",
    },
    {
      name: "Tokyo",
      country: "Japan",
      icon: <Utensils size={18} />,
      color: "#1E1B4B",
    },
    {
      name: "Pattaya",
      country: "Thailand",
      icon: <Waves size={18} />,
      color: "#0E7490",
    },
    {
      name: "Taipei",
      country: "Taiwan",
      icon: <Building2 size={18} />,
      color: "#431407",
    },
    {
      name: "Mecca",
      country: "Saudi Arabia",
      icon: <Star size={18} />,
      color: "#064E3B",
    },
    {
      name: "Guangzhou",
      country: "China",
      icon: <Plane size={18} />,
      color: "#111827",
    },
    {
      name: "Prague",
      country: "Czech Republic",
      icon: <Beer size={18} />,
      color: "#78350F",
    },
    {
      name: "Seoul",
      country: "South Korea",
      icon: <Music size={18} />,
      color: "#4C1D95",
    },
    {
      name: "Amsterdam",
      country: "Netherlands",
      icon: <Beer size={18} />,
      color: "#C2410C",
    },
    {
      name: "Miami",
      country: "USA",
      icon: <Sun size={18} />,
      color: "#0891B2",
    },
    {
      name: "Barcelona",
      country: "Spain",
      icon: <Waves size={18} />,
      color: "#1D4ED8",
    },
    {
      name: "Vienna",
      country: "Austria",
      icon: <Music size={18} />,
      color: "#701A75",
    },
    {
      name: "Shanghai",
      country: "China",
      icon: <Building2 size={18} />,
      color: "#3F6212",
    },
    {
      name: "Madrid",
      country: "Spain",
      icon: <Wine size={18} />,
      color: "#9D174D",
    },
    {
      name: "Bali",
      country: "Indonesia",
      icon: <TreePalm size={18} />,
      color: "#065F46",
    },
  ];

  return (
    <div className="p-8 flex flex-wrap gap-8 bg-gray-50">
      {DEMO_CITIES.map((city, i) => (
        <Stamp
          key={city.name}
          city={city.name}
          country={city.country}
          // date="24 JUL 2024"
          variant={city.name === "Tokyo" ? "circle" : "rounded"}
          border={BORDER_STYLES[i % BORDER_STYLES.length]}
          color={STAMP_COLORS[i % STAMP_COLORS.length]}
          icon={city.icon}
        />
      ))}
    </div>
  );
}
