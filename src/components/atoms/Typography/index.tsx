import React from "react";

type TypographyVariant = "h1" | "h2" | "h3" | "h4" | "p" | "upheader";

interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function Typography({
  variant = "p",
  children,
  className = "",
  as,
}: TypographyProps) {
  const Component = as || (variant === "upheader" ? "p" : variant);

  const variantStyles = {
    h1: "text-[36px] font-bold font-sora text-app-text tracking-tight",
    h2: "text-[24px] font-bold font-sora text-app-text tracking-tight",
    h3: "text-[20px] font-bold font-sora text-app-text tracking-tight",
    h4: "text-[18px] font-bold font-sora text-app-text tracking-tight",
    p: "text-[16px] font-inter text-secondary leading-relaxed",
    upheader:
      "text-[12px] font-bold font-inter text-secondary uppercase tracking-widest",
  };

  return (
    <Component className={`${variantStyles[variant]} ${className}`}>
      {children}
    </Component>
  );
}
