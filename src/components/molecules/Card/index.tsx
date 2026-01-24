import React from "react";

interface CardProps {
  children: React.ReactNode;
  variant?: "surface" | "surface-secondary";
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  variant = "surface",
  className = "",
  hover = true,
}: CardProps) {
  const baseStyles = "rounded-3xl overflow-hidden transition-all duration-300";

  const variantStyles = {
    surface: "bg-surface shadow-sm",
    "surface-secondary": "bg-surface-secondary",
  };

  const hoverStyles = hover ? "hover:shadow-xl hover:-translate-y-1" : "";

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
}
