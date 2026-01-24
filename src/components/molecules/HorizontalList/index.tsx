import React from "react";

interface HorizontalListProps {
  children: React.ReactNode;
  className?: string;
  noScrollbar?: boolean;
  gap?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
}

export default function HorizontalList({
  children,
  className = "",
  noScrollbar = true,
  gap = "sm",
}: HorizontalListProps) {
  return (
    <div
      className={`flex gap-${gap} overflow-x-scroll pb-md ${
        noScrollbar ? "no-scrollbar" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
