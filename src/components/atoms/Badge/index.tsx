import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("px-2 py-0.5 text-micro font-bold rounded-full", {
  variants: {
    variant: {
      default: "bg-brand text-inverse",
      secondary: "bg-surface-secondary text-secondary",
      success: "bg-success text-inverse",
      warning: "bg-warning text-inverse",
      danger: "bg-error text-inverse",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export default function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
