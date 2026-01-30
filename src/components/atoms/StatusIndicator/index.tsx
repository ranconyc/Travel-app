import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusIndicatorVariants = cva("h-2 w-2 rounded-full", {
  variants: {
    variant: {
      online: "bg-success",
      offline: "bg-error",
      busy: "bg-warning",
      away: "bg-surface-secondary",
    },
  },
  defaultVariants: {
    variant: "offline",
  },
});

export interface StatusIndicatorProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusIndicatorVariants> {
  isOnline?: boolean; // Backward compatibility
}

export default function StatusIndicator({
  className,
  variant,
  isOnline,
  ...props
}: StatusIndicatorProps) {
  // Prioritize explicit variant, fallback to isOnline prop
  const effectiveVariant =
    variant ||
    (isOnline === true ? "online" : isOnline === false ? "offline" : undefined);

  return (
    <div
      className={cn(
        statusIndicatorVariants({ variant: effectiveVariant }),
        className,
      )}
      {...props}
    />
  );
}
