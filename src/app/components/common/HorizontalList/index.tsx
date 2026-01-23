import React from "react";

interface HorizontalListProps {
  children: React.ReactNode;
  className?: string;
  noScrollbar?: boolean;
  gap?: number;
}

export default function HorizontalList({
  children,
  className = "",
  noScrollbar = true,
  gap = 4,
}: HorizontalListProps) {
  return (
    <div
      className={`flex gap-${gap} overflow-x-scroll pb-4 ${
        noScrollbar ? "no-scrollbar" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
