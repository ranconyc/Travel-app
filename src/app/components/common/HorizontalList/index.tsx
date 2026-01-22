import React from "react";

interface HorizontalListProps {
  children: React.ReactNode;
  className?: string;
  noScrollbar?: boolean;
}

export default function HorizontalList({
  children,
  className = "",
  noScrollbar = true,
}: HorizontalListProps) {
  return (
    <div
      className={`flex gap-4 overflow-x-scroll pb-4 ${
        noScrollbar ? "no-scrollbar" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
