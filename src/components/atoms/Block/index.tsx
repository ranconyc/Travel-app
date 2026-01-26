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
      className={`bg-bg-card text-txt-main p-md rounded-pill flex flex-col gap-sm ${
        className === "w-fit" ? "w-fit" : "w-full"
      } ${className}`}
    >
      {children}
    </Component>
  );
}
