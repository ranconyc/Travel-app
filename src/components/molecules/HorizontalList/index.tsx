import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const horizontalListVariants = cva("flex overflow-x-scroll pb-md", {
  variants: {
    gap: {
      xxs: "gap-xxs",
      xs: "gap-xs",
      sm: "gap-sm",
      md: "gap-md",
      lg: "gap-lg",
      xl: "gap-xl",
    },
    noScrollbar: {
      true: "scrollbar-hide",
      false: "",
    },
  },
  defaultVariants: {
    gap: "sm",
    noScrollbar: true,
  },
});

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
      className={cn(horizontalListVariants({ gap, noScrollbar }), className)}
    >
      {children}
    </div>
  );
}
