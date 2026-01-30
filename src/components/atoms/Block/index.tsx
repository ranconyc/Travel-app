import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const blockVariants = cva(
  "bg-surface text-txt-main p-lg rounded-card shadow-card border border-surface-secondary/50 backdrop-blur-sm animate-scale-in",
  {
    variants: {
      width: {
        full: "w-full",
        fit: "w-fit",
      },
    },
    defaultVariants: {
      width: "full",
    },
  },
);

export interface BlockProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof blockVariants> {
  as?: React.ElementType;
}

export default function Block({
  children,
  className = "",
  width,
  as: Component = "div",
  ...props
}: BlockProps) {
  // If className contains w-fit, we can infer width="fit" for backward compatibility
  // but CVA is preferred.
  const inferredWidth = width || (className.includes("w-fit") ? "fit" : "full");

  return (
    <Component
      className={cn(blockVariants({ width: inferredWidth }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}
