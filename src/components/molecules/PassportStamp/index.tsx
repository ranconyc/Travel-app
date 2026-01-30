import React, { memo } from "react";
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
  Check,
} from "lucide-react";
import Typography from "@/components/atoms/Typography";

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
  isVerified?: boolean;
}

function PassportStamp({
  city,
  country,
  date,
  index,
  variant,
  color,
  size = "md",
  showIcon = true,
  rotation,
  isVerified,
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
          textVariant: "micro" as const,
          cityVariant: "ui-sm" as const,
        };
      case "lg":
        return {
          padding: "p-1.5",
          innerPadding: "p-5",
          textVariant: "caption" as const,
          cityVariant: "h2" as const,
        };
      case "xl":
        return {
          padding: "p-2",
          innerPadding: "p-6",
          textVariant: "body-sm" as const,
          cityVariant: "h1" as const,
        };
      case "md":
      default:
        return {
          padding: "p-1",
          innerPadding: "p-md",
          textVariant: "micro" as const,
          cityVariant: "h3" as const,
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
        className={`w-fit border-4 ${sizeClasses.innerPadding} flex flex-col items-center justify-center gap-1 ${radiusClass} relative`}
        style={{
          borderColor: stampColor,
          borderStyle: borderInner,
          color: stampColor,
        }}
      >
        {isVerified && (
          <div className="absolute top-1 right-1 bg-white dark:bg-bg-dark rounded-full p-0.5 shadow-sm border border-current">
            <Check size={size === "sm" ? 8 : 10} strokeWidth={3} />
          </div>
        )}
        {IconComponent && (
          <div className="mb-0.5 opacity-80" style={{ color: stampColor }}>
            <IconComponent
              size={
                size === "sm"
                  ? 12
                  : size === "lg"
                    ? 20
                    : size === "xl"
                      ? 24
                      : 16
              }
            />
          </div>
        )}
        <Typography
          variant={sizeClasses.textVariant}
          weight="black"
          className="uppercase tracking-[0.2em] opacity-90"
        >
          {country}
        </Typography>

        <Typography
          variant={sizeClasses.cityVariant}
          weight="black"
          className="uppercase leading-none tracking-tighter"
        >
          {city}
        </Typography>

        {date && (
          <Typography
            variant={sizeClasses.textVariant}
            weight="bold"
            className="font-mono border-t mt-1 pt-1"
            style={{ borderTopColor: stampColor }}
          >
            {date}
          </Typography>
        )}
      </div>
    </div>
  );
}

export default memo(PassportStamp);
