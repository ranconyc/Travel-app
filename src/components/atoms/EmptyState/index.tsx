import React from "react";
import Typography from "@/components/atoms/Typography";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center py-20 px-md text-center",
  {
    variants: {
      variant: {
        default: "",
        compact: "py-10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface EmptyStateProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon,
  className = "",
  variant,
  ...props
}: EmptyStateProps) {
  return (
    <div className={cn(emptyStateVariants({ variant }), className)} {...props}>
      {icon && (
        <div className="w-16 h-16 bg-bg-sub rounded-full flex items-center justify-center text-txt-sec mb-md">
          {icon}
        </div>
      )}
      <Typography variant="h3" className="mb-2">
        {title}
      </Typography>
      {description && (
        <Typography variant="p" className="text-txt-sec">
          {description}
        </Typography>
      )}
    </div>
  );
}
