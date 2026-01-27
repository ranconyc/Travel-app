import React from "react";

interface BlockProps {
  children?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function Block({
  children,
  className = "",
  as: Component = "div",
}: BlockProps) {
  return (
    <Component
      className={`bg-surface text-txt-main p-6 rounded-2xl shadow-sm border border-surface-secondary/50 backdrop-blur-sm animate-scale-in ${
        className.includes("w-fit") ? "w-fit" : "w-full"
      } ${className}`}
    >
      {children}
    </Component>
  );
}
