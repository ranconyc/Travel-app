import React from "react";

export type StampStyle =
  | "circle"
  | "oval"
  | "hexagon"
  | "diamond"
  | "rounded-rect"
  | "wavy-circle"
  | "octagon"
  | "square"
  | "ticket"
  | "badge"
  // New Geometric
  | "triangle-red"
  | "triangle-blue"
  | "triangle-green"
  | "pentagon-orange"
  | "pentagon-purple"
  | "heptagon-teal"
  | "decagon-red"
  | "rhombus-indigo"
  | "parallelogram-pink"
  | "trapezoid-cyan"
  | "chevron-gold"
  | "cross-emerald"
  // Special Shapes
  | "shield-blue"
  | "shield-red"
  | "shield-gold"
  | "star-gold"
  | "star-blue"
  | "banner-green"
  | "cloud-sky"
  // Styles
  | "circle-double-red"
  | "circle-dashed-blue"
  | "rect-double-brown"
  | "rect-dashed-orange"
  | "oval-double-purple"
  // Minimal
  | "minimal-circle"
  | "minimal-square"
  | "minimal-rect"
  // Retro
  | "retro-ticket-1"
  | "retro-ticket-2"
  | "retro-badge-1"
  | "retro-badge-2"
  // Detailed
  | "detailed-hexagon"
  | "detailed-octagon"
  | "detailed-shield"
  // Tech/Modern
  | "tech-hex-cyan"
  | "tech-rect-slate"
  // Nature
  | "nature-leaf-green" // using chevron as leaf
  | "nature-flower-pink" // using wavy-circle
  // Space
  | "space-planet-indigo" // using circle
  | "space-rocket-red" // using triangle
  // Ocean
  | "ocean-wave-blue" // using wavy-circle
  | "ocean-shell-teal"; // using pentagon

interface CityStampProps {
  cityName: string;
  countryName: string;
  date?: string;
  variant?: StampStyle;
  icon?: React.ReactNode;
  className?: string; // Add className prop
}

const stampVariants: Record<StampStyle, string> = {
  // Originals
  circle:
    "rounded-full border-[3px] border-[#e63946] rotate-2 w-24 h-24 flex items-center justify-center relative",
  oval: "rounded-full border-[3px] border-[#457b9d] -rotate-1 w-28 h-20 flex items-center justify-center relative",
  hexagon:
    "border-[#2a9d8f] rotate-3 w-24 h-24 flex items-center justify-center relative hexagon-shape text-[#2a9d8f]",
  diamond:
    "rotate-45 border-[3px] border-[#e76f51] w-20 h-20 flex items-center justify-center relative",
  "rounded-rect":
    "rounded-lg border-[3px] border-[#f4a261] -rotate-2 w-28 h-20 flex items-center justify-center px-3 relative",
  "wavy-circle":
    "rounded-full border-[3px] border-dashed border-[#219ebc] rotate-3 w-24 h-24 flex items-center justify-center relative",
  octagon:
    "border-[#8338ec] -rotate-2 w-24 h-24 flex items-center justify-center relative octagon-shape text-[#8338ec]",
  square:
    "border-[3px] border-[#06a77d] rotate-2 w-24 h-24 flex items-center justify-center relative",
  ticket:
    "rounded-sm border-[3px] border-double border-[#d62828] rotate-1 w-28 h-20 flex items-center justify-center px-2 relative",
  badge:
    "rounded border-[3px] border-dashed border-[#6a4c93] -rotate-1 w-28 h-20 flex items-center justify-center px-2 relative",

  // New Geometric
  "triangle-red":
    "triangle-shape text-red-600 w-24 h-24 flex items-end justify-center pb-4 rotate-3 relative",
  "triangle-blue":
    "triangle-shape text-blue-600 w-24 h-24 flex items-end justify-center pb-4 -rotate-2 relative",
  "triangle-green":
    "triangle-shape text-green-600 w-24 h-24 flex items-end justify-center pb-4 rotate-1 relative",
  "pentagon-orange":
    "pentagon-shape text-orange-500 w-24 h-24 flex items-center justify-center pt-2 relative",
  "pentagon-purple":
    "pentagon-shape text-purple-500 w-24 h-24 flex items-center justify-center pt-2 -rotate-3 relative",
  "heptagon-teal":
    "heptagon-shape text-teal-600 w-24 h-24 flex items-center justify-center relative",
  "decagon-red":
    "decagon-shape text-red-700 w-24 h-24 flex items-center justify-center relative",
  "rhombus-indigo":
    "rhombus-shape text-indigo-600 w-28 h-20 flex items-center justify-center relative",
  "parallelogram-pink":
    "parallelogram-shape text-pink-500 w-28 h-20 flex items-center justify-center relative skew-x-6",
  "trapezoid-cyan":
    "trapezoid-shape text-cyan-600 w-28 h-20 flex items-center justify-center pb-2 relative",
  "chevron-gold":
    "chevron-shape text-yellow-600 w-24 h-24 flex items-center justify-center pr-2 relative",
  "cross-emerald":
    "cross-shape text-emerald-600 w-24 h-24 flex items-center justify-center relative",

  // Shields & Stars
  "shield-blue":
    "shield-shape text-blue-700 w-24 h-24 flex items-start justify-center pt-6 relative",
  "shield-red":
    "shield-shape text-red-700 w-24 h-24 flex items-start justify-center pt-6 -rotate-2 relative",
  "shield-gold":
    "shield-shape text-yellow-700 w-24 h-24 flex items-start justify-center pt-6 rotate-2 relative",
  "star-gold":
    "star-5-shape text-yellow-600 w-24 h-24 flex items-center justify-center pt-2 relative",
  "star-blue":
    "star-5-shape text-blue-600 w-24 h-24 flex items-center justify-center pt-2 -rotate-3 relative",
  "banner-green":
    "banner-shape text-green-700 w-28 h-20 flex items-start justify-center pt-4 relative",
  "cloud-sky":
    "cloud-shape text-sky-500 w-28 h-20 flex items-center justify-center relative",

  // Varied Styles
  "circle-double-red":
    "rounded-full border-[5px] border-double border-red-600 w-24 h-24 flex items-center justify-center rotate-3 relative",
  "circle-dashed-blue":
    "rounded-full border-[3px] border-dashed border-blue-600 w-24 h-24 flex items-center justify-center -rotate-2 relative",
  "rect-double-brown":
    "rounded-sm border-[5px] border-double border-amber-800 w-28 h-20 flex items-center justify-center relative",
  "rect-dashed-orange":
    "rounded-md border-[3px] border-dashed border-orange-500 w-28 h-20 flex items-center justify-center relative",
  "oval-double-purple":
    "rounded-[50%] border-[5px] border-double border-purple-600 w-28 h-20 flex items-center justify-center relative",

  // Minimal
  "minimal-circle":
    "rounded-full border border-gray-800 w-24 h-24 flex items-center justify-center relative text-gray-800",
  "minimal-square":
    "border border-gray-800 w-24 h-24 flex items-center justify-center relative text-gray-800",
  "minimal-rect":
    "rounded border border-gray-800 w-28 h-20 flex items-center justify-center relative text-gray-800",

  // Retro
  "retro-ticket-1":
    "ticket-shape rounded border-[2px] border-dashed border-rose-700 w-28 h-20 flex items-center justify-center relative text-rose-700",
  "retro-ticket-2":
    "ticket-shape rounded border-[3px] border-dotted border-teal-700 w-28 h-20 flex items-center justify-center relative text-teal-700",
  "retro-badge-1":
    "badge-shape rounded border-[2px] border-solid border-indigo-700 w-24 h-24 flex items-center justify-center relative text-indigo-700",
  "retro-badge-2":
    "badge-shape rounded border-[4px] border-double border-amber-700 w-24 h-24 flex items-center justify-center relative text-amber-700",

  // Detailed
  "detailed-hexagon":
    "hexagon-shape text-slate-700 w-24 h-24 flex items-center justify-center relative",
  "detailed-octagon":
    "octagon-shape text-purple-800 w-24 h-24 flex items-center justify-center relative",
  "detailed-shield":
    "shield-shape text-blue-900 w-24 h-24 flex items-start justify-center pt-6 relative",

  // Tech
  "tech-hex-cyan":
    "hexagon-shape text-cyan-500 w-24 h-24 flex items-center justify-center relative font-mono",
  "tech-rect-slate":
    "rounded border-2 border-slate-500 w-28 h-20 flex items-center justify-center relative font-mono text-slate-500",

  // Thematic
  "nature-leaf-green":
    "chevron-shape text-green-600 w-24 h-24 flex items-center justify-center relative -rotate-45",
  "nature-flower-pink":
    "wavy-circle text-pink-500 rounded-full border-[3px] border-pink-500 w-24 h-24 flex items-center justify-center relative",
  "space-planet-indigo":
    "rounded-full border-[4px] border-indigo-600 w-24 h-24 flex items-center justify-center relative text-indigo-600",
  "space-rocket-red":
    "triangle-shape text-red-600 w-24 h-24 flex items-end justify-center pb-4 relative",
  "ocean-wave-blue":
    "wavy-circle text-blue-500 rounded-full border-[3px] border-blue-500 w-24 h-24 flex items-center justify-center relative",
  "ocean-shell-teal":
    "pentagon-shape text-teal-500 w-24 h-24 flex items-center justify-center pt-2 relative",
};

export const CityStamp: React.FC<CityStampProps> = ({
  cityName,
  countryName,
  date,
  variant = "circle",
  icon,
  className = "",
}) => {
  const stampClass = stampVariants[variant];
  // Simple check for text color override if needed, but classes handle it generally.
  // We rely on 'text-xyz' classes in the variants to set currentColor for borders and text.

  const renderContent = () => {
    const isDiamond = variant === "diamond" || variant === "rhombus-indigo";
    const isTriangle = variant.includes("triangle");

    return (
      <div
        className={`${isDiamond ? "-rotate-45" : ""} ${
          isTriangle ? "pb-1" : ""
        } flex flex-col items-center justify-center text-center gap-0.5 px-2 z-10`}
      >
        {icon && <div className="mb-0.5 opacity-80">{icon}</div>}
        <div className="text-micro font-black uppercase leading-tight tracking-wide">
          {cityName}
        </div>
        <div className="text-p font-semibold uppercase opacity-70 leading-tight tracking-wider">
          {countryName}
        </div>
        {date && (
          <div className="text-p font-medium opacity-60 mt-0.5">{date}</div>
        )}
      </div>
    );
  };

  return (
    <div className={`inline-block ${className}`}>
      <div className={`${stampClass} transition-transform hover:scale-105`}>
        {/* Inner decorative border for some variants */}
        {(variant === "circle" ||
          variant === "oval" ||
          variant.includes("double")) && (
          <div className="absolute inset-1 rounded-[inherit] border border-current opacity-30 pointer-events-none" />
        )}
        {renderContent()}
      </div>
    </div>
  );
};

// Export all stamp variants for easy usage
export const stampStyles: StampStyle[] = Object.keys(
  stampVariants,
) as StampStyle[];
