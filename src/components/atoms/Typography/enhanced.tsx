import React from "react";

type TypographyVariant =
  | "display-xl" | "display-lg" | "display-md" | "display-sm"
  | "h1" | "h2" | "h3" | "h4"
  | "body-lg" | "body" | "body-sm"
  | "ui-lg" | "ui" | "ui-sm"
  | "label" | "label-sm"
  | "caption" | "caption-sm"
  | "micro" | "micro-sm";

interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  color?: "main" | "sec" | "muted" | "brand" | "success" | "warning" | "error" | "white" | "inverse";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  truncate?: boolean;
}

export default function Typography({
  variant = "body",
  children,
  className = "",
  as,
  color = "main",
  weight,
  truncate = false,
}: TypographyProps) {
  const tagMap: Record<TypographyVariant, React.ElementType> = {
    "display-xl": "h1",
    "display-lg": "h1", 
    "display-md": "h2",
    "display-sm": "h2",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    "body-lg": "p",
    body: "p",
    "body-sm": "p",
    "ui-lg": "p",
    ui: "p",
    "ui-sm": "p",
    label: "span",
    "label-sm": "span",
    caption: "p",
    "caption-sm": "p",
    micro: "span",
    "micro-sm": "span",
  };

  const Component = as || tagMap[variant];

  // Enhanced variant styles using new CSS utilities
  const variantStyles = {
    // Display typography
    "display-xl": "text-display-xl",
    "display-lg": "text-display-lg",
    "display-md": "text-display-md", 
    "display-sm": "text-display-sm",
    
    // Heading typography
    h1: "text-h1-enhanced",
    h2: "text-h2-enhanced",
    h3: "text-h3-enhanced",
    h4: "text-h4-enhanced",
    
    // Body typography
    "body-lg": "text-body-lg",
    body: "text-body",
    "body-sm": "text-body-sm",
    
    // UI typography
    "ui-lg": "text-ui-lg",
    ui: "text-ui",
    "ui-sm": "text-ui-sm",
    
    // Label typography
    label: "text-label",
    "label-sm": "text-label-sm",
    
    // Caption typography
    caption: "text-caption",
    "caption-sm": "text-caption-sm",
    
    // Micro typography
    micro: "text-micro-enhanced",
    "micro-sm": "text-micro-sm",
  };

  // Enhanced color system
  const colorStyles = {
    main: "text-primary",
    sec: "text-secondary", 
    muted: "text-muted",
    brand: "text-brand",
    success: "text-green-500",
    warning: "text-yellow-500", 
    error: "text-red-500",
    white: "text-white",
    inverse: "text-inverse",
  };

  // Weight overrides
  const weightStyles = {
    light: "text-light",
    normal: "text-normal",
    medium: "text-medium", 
    semibold: "text-semibold",
    bold: "text-bold",
  };

  // Utility styles
  const utilityStyles: Record<string, string> = {
    true: "truncate",
    false: "",
  };

  const combinedClasses = [
    variantStyles[variant],
    colorStyles[color],
    weight && weightStyles[weight],
    utilityStyles[String(truncate)],
    className,
  ].filter(Boolean).join(" ");

  return (
    <Component className={combinedClasses}>
      {children}
    </Component>
  );
}
