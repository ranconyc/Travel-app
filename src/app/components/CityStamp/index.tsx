import React from "react";

type StampStyle =
  | "circle"
  | "oval"
  | "hexagon"
  | "diamond"
  | "rounded-rect"
  | "wavy-circle"
  | "octagon"
  | "square"
  | "ticket"
  | "badge";

interface CityStampProps {
  cityName: string;
  countryName: string;
  date?: string;
  variant?: StampStyle;
}

const stampVariants: Record<StampStyle, string> = {
  circle:
    "rounded-full border-[3px] border-[#e63946] rotate-2 w-24 h-24 flex items-center justify-center relative",
  oval: "rounded-full border-[3px] border-[#457b9d] -rotate-1 w-28 h-20 flex items-center justify-center relative",
  hexagon:
    "border-[3px] border-[#2a9d8f] rotate-3 w-24 h-24 flex items-center justify-center relative hexagon-shape",
  diamond:
    "rotate-45 border-[3px] border-[#e76f51] w-20 h-20 flex items-center justify-center relative",
  "rounded-rect":
    "rounded-lg border-[3px] border-[#f4a261] -rotate-2 w-28 h-20 flex items-center justify-center px-3 relative",
  "wavy-circle":
    "rounded-full border-[3px] border-dashed border-[#219ebc] rotate-3 w-24 h-24 flex items-center justify-center relative",
  octagon:
    "border-[3px] border-[#8338ec] -rotate-2 w-24 h-24 flex items-center justify-center relative octagon-shape",
  square:
    "border-[3px] border-[#06a77d] rotate-2 w-24 h-24 flex items-center justify-center relative",
  ticket:
    "rounded-sm border-[3px] border-double border-[#d62828] rotate-1 w-28 h-20 flex items-center justify-center px-2 relative",
  badge:
    "rounded border-[3px] border-dashed border-[#6a4c93] -rotate-1 w-28 h-20 flex items-center justify-center px-2 relative",
};

const textColorVariants: Record<StampStyle, string> = {
  circle: "text-[#e63946]",
  oval: "text-[#457b9d]",
  hexagon: "text-[#2a9d8f]",
  diamond: "text-[#e76f51]",
  "rounded-rect": "text-[#f4a261]",
  "wavy-circle": "text-[#219ebc]",
  octagon: "text-[#8338ec]",
  square: "text-[#06a77d]",
  ticket: "text-[#d62828]",
  badge: "text-[#6a4c93]",
};

export const CityStamp: React.FC<CityStampProps> = ({
  cityName,
  countryName,
  date,
  variant = "circle",
}) => {
  const stampClass = stampVariants[variant];
  const textColor = textColorVariants[variant];

  const renderContent = () => {
    const isDiamond = variant === "diamond";

    return (
      <div
        className={`${isDiamond ? "-rotate-45" : ""} flex flex-col items-center justify-center text-center gap-0.5 px-2`}
      >
        <div
          className={`text-[11px] font-black uppercase ${textColor} leading-tight tracking-wide`}
        >
          {cityName}
        </div>
        <div
          className={`text-[8px] font-semibold uppercase ${textColor} opacity-70 leading-tight tracking-wider`}
        >
          {countryName}
        </div>
        {date && (
          <div
            className={`text-[7px] font-medium ${textColor} opacity-60 mt-0.5`}
          >
            {date}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="inline-block">
      <div className={stampClass}>
        {/* Inner decorative border for some variants */}
        {(variant === "circle" || variant === "oval") && (
          <div className="absolute inset-1 rounded-full border border-current opacity-30" />
        )}
        {renderContent()}
      </div>
    </div>
  );
};

// Export all stamp variants for easy usage
export const stampStyles: StampStyle[] = [
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
];
