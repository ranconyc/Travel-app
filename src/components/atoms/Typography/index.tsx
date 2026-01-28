import React from "react";

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "sm"
  | "tiny"
  | "micro";

interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  color?: "main" | "sec" | "brand" | "error";
}

export default function Typography({
  variant = "p",
  children,
  className = "",
  as,
  color = "sec",
}: TypographyProps) {
  const tagMap: Record<TypographyVariant, React.ElementType> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    p: "p",
    sm: "p",
    tiny: "span",
    micro: "span",
  };

  const Component = as || tagMap[variant];

  // Map variant to Tailwind typography classes (defined in globals.css @theme)
  const variantStyles = {
    h1: "text-display-lg",
    h2: "text-display-md",
    h3: "text-display-sm",
    h4: "text-display-sm" /* Consolidated to SM per 2026 std */,
    p: "text-p font-sans",
    sm: "text-sm font-sans",
    tiny: "text-caption font-sans uppercase",
    micro: "text-micro font-sans uppercase tracking-[0.05em]",
  };

  // Handle semantic coloring with Design System v2 tokens
  const colorStyles = {
    main: "text-txt-main",
    sec: "text-txt-sec",
    brand: "text-brand",
    error: "text-error",
  };

  // Determine default color based on variant if not explicitly provided
  const resolvedColor =
    ["h1", "h2", "h3", "h4"].includes(variant) && color === "sec"
      ? "main"
      : color;

  return (
    <Component
      className={`${variantStyles[variant]} ${colorStyles[resolvedColor]} ${className}`}
    >
      {children}
    </Component>
  );
}
