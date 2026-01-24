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
  Ship,
  Train,
  Landmark,
  Castle,
} from "lucide-react";

const BORDER_STYLES = [
  "solid",
  "dashed",
  "dotted",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset",
];

const STAMP_COLORS = [
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

const STAMP_ICONS = [
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
  Ship,
  Train,
  Landmark,
  Castle,
];

interface PassportStampProps {
  city: string;
  country: string;
  date?: string;
  index: number;
  variant?: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showIcon?: boolean;
  rotation?: number;
}

export default function PassportStamp({
  city,
  country,
  date,
  index,
  variant,
  color,
  size = "md",
  showIcon = true,
  rotation,
}: PassportStampProps) {
  const getVariant = () => {
    if (variant) return variant;
    const patterns = [
      "rect-rounded", // Classic rounded rectangle
      "tall-rect", // Vertical passport stamp
      "oval", // Tall oval shape
      "hexagon", // Six-sided
      "double-circle", // Circle with double border
      "notched-rect", // Rectangle with notched corners
      "wave", // Wavy asymmetric
      "shield", // Shield/badge shape
    ];
    return patterns[index % patterns.length];
  };

  const selectedVariant = getVariant();

  const getRadiusClass = () => {
    switch (selectedVariant) {
      case "rect-rounded":
        return "rounded-xl";
      case "tall-rect":
        return "rounded-2xl";
      case "oval":
        return "rounded-full";
      case "hexagon":
        return "rounded-lg";
      case "double-circle":
        return "rounded-full aspect-square";
      case "notched-rect":
        return "rounded-tl-none rounded-tr-2xl rounded-br-none rounded-bl-2xl";
      case "wave":
        return "rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md";
      case "shield":
        return "rounded-t-full rounded-b-3xl";
      default:
        return "rounded-xl";
    }
  };

  const getSpecialStyles = () => {
    if (selectedVariant === "tall-rect") {
      return { container: "", wrapper: "aspect-[2/3]", extraBorder: "" };
    }
    if (selectedVariant === "oval") {
      return { container: "", wrapper: "aspect-[3/4]", extraBorder: "" };
    }
    if (selectedVariant === "double-circle") {
      return {
        container: "p-1",
        wrapper: "",
        extraBorder: "shadow-[0_0_0_3px_white,0_0_0_5px_currentColor]",
      };
    }
    return { container: "", wrapper: "", extraBorder: "" };
  };

  const specialStyles = getSpecialStyles();

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          padding: "p-1",
          innerPadding: "p-2",
          text: "text-[8px]",
          cityText: "text-sm",
        };
      case "lg":
        return {
          padding: "p-1.5",
          innerPadding: "p-5",
          text: "text-xs",
          cityText: "text-2xl",
        };
      case "xl":
        return {
          padding: "p-2",
          innerPadding: "p-6",
          text: "text-sm",
          cityText: "text-3xl",
        };
      case "md":
      default:
        return {
          padding: "p-1",
          innerPadding: "p-4",
          text: "text-[10px]",
          cityText: "text-xl",
        };
    }
  };

  const radiusClass = getRadiusClass();
  const sizeClasses = getSizeClasses();

  const borderTop = BORDER_STYLES[index % BORDER_STYLES.length];
  const borderInner = BORDER_STYLES[(index * 3 + 2) % BORDER_STYLES.length];
  const stampColor = color || STAMP_COLORS[index % STAMP_COLORS.length];
  const stampRotation =
    rotation !== undefined ? rotation : ((index * 17) % 21) - 10;

  const IconComponent = showIcon
    ? STAMP_ICONS[index % STAMP_ICONS.length]
    : null;

  return (
    <div
      className={`text-center opacity-70 dark:opacity-100 ${sizeClasses.padding} ${specialStyles.container} h-fit w-fit border-2 ${radiusClass} ${specialStyles.extraBorder || ""} transition-all duration-300 hover:scale-110 hover:opacity-90 hover:shadow-lg`}
      style={{
        borderColor: stampColor,
        borderStyle: borderTop,
        transform: `rotate(${stampRotation}deg)`,
      }}
    >
      <div
        className={`w-fit border-4 ${sizeClasses.innerPadding} flex flex-col items-center justify-center gap-1 ${radiusClass}`}
        style={{
          borderColor: stampColor,
          borderStyle: borderInner,
          color: stampColor,
        }}
      >
        <span
          className={`${sizeClasses.text} font-black uppercase tracking-[0.2em] opacity-90`}
        >
          {country}
        </span>

        <h1
          className={`${sizeClasses.cityText} font-black uppercase leading-none tracking-tighter `}
        >
          {city}
        </h1>

        {/* {IconComponent && (
          <div className="my-1 opacity-80">
            <IconComponent
              size={
                size === "sm"
                  ? 14
                  : size === "lg"
                    ? 24
                    : size === "xl"
                      ? 28
                      : 18
              }
              strokeWidth={2.5}
            />
          </div>
        )} */}

        {date && (
          <p
            className={`${sizeClasses.text} font-mono font-bold border-t mt-1 pt-1`}
            style={{ borderTopColor: stampColor }}
          >
            {date}
          </p>
        )}
      </div>
    </div>
  );
}
