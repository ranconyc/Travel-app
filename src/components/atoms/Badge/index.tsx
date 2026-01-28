import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "success" | "warning" | "danger";
}

const variantClasses = {
  default: "bg-brand text-inverse",
  secondary: "bg-surface-secondary text-secondary",
  success: "bg-success text-inverse",
  warning: "bg-warning text-inverse",
  danger: "bg-error text-inverse",
};

export default function Badge({
  children,
  className,
  variant = "default",
}: BadgeProps) {
  return (
    <div
      className={cn(
        "px-2 py-0.5 text-micro font-bold rounded-full",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
