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
  | "triangle"
  | "dashed-rect";

interface CityStampProps {
  cityName: string;
  countryName: string;
  date?: string;
  variant?: StampStyle;
}

const stampVariants: Record<StampStyle, string> = {
  circle:
    "rounded-full border-2 border-[#e63946] rotate-2 w-24 h-24 flex items-center justify-center",
  oval: "rounded-[50%] border-2 border-[#457b9d] -rotate-1 w-28 h-20 flex items-center justify-center",
  hexagon:
    "clip-hexagon border-2 border-[#2a9d8f] rotate-1 w-24 h-24 flex items-center justify-center",
  diamond:
    "rotate-45 border-2 border-[#e76f51] w-20 h-20 flex items-center justify-center",
  "rounded-rect":
    "rounded-lg border-2 border-[#f4a261] -rotate-2 w-28 h-20 flex items-center justify-center px-3",
  "wavy-circle":
    "rounded-full border-2 border-dashed border-[#219ebc] rotate-3 w-24 h-24 flex items-center justify-center",
  octagon:
    "clip-octagon border-2 border-[#8338ec] -rotate-2 w-24 h-24 flex items-center justify-center",
  square:
    "border-2 border-[#06a77d] rotate-2 w-24 h-24 flex items-center justify-center",
  triangle:
    "clip-triangle border-2 border-[#d62828] w-24 h-24 flex items-center justify-center",
  "dashed-rect":
    "rounded border-2 border-dashed border-[#6a4c93] rotate-1 w-28 h-20 flex items-center justify-center px-2",
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
  triangle: "text-[#d62828]",
  "dashed-rect": "text-[#6a4c93]",
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
    const isTriangle = variant === "triangle";

    return (
      <div
        className={`${isDiamond || isTriangle ? "-rotate-45" : ""} flex flex-col items-center justify-center text-center gap-0.5`}
      >
        <div
          className={`text-[10px] font-bold uppercase ${textColor} leading-tight`}
        >
          {cityName}
        </div>
        <div
          className={`text-[7px] uppercase ${textColor} opacity-80 leading-tight`}
        >
          {countryName}
        </div>
        {date && (
          <div className={`text-[7px] ${textColor} opacity-70 mt-0.5`}>
            {date}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="inline-block">
      <div className={stampClass}>{renderContent()}</div>
    </div>
  );
};

// Export all 10 stamp variants for easy usage
export const stampStyles: StampStyle[] = [
  "circle",
  "oval",
  "hexagon",
  "diamond",
  "rounded-rect",
  "wavy-circle",
  "octagon",
  "square",
  "triangle",
  "dashed-rect",
];
