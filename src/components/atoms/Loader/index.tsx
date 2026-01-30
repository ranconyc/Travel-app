import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const loaderVariants = cva("animate-spin", {
  variants: {
    variant: {
      default: "text-brand",
      secondary: "text-secondary",
      white: "text-white",
    },
    // We can map common sizes to Tailwind classes or pixels
    size: {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
      xl: "w-12 h-12",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface LoaderProps
  extends React.SVGAttributes<SVGElement>, VariantProps<typeof loaderVariants> {
  // Allow explicit pixel size override if needed, otherwise use size variant
  pxSize?: number;
}

export default function Loader({
  className,
  variant,
  size,
  pxSize,
  ...props
}: LoaderProps) {
  return (
    <Loader2
      className={cn(
        loaderVariants({ variant, size: pxSize ? null : size }),
        className,
      )}
      style={pxSize ? { width: pxSize, height: pxSize } : undefined}
      {...props}
    />
  );
}
