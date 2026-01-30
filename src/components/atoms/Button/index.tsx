"use client";

import { Loader2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

// Define button variants with CVA
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-sm focus:ring-brand/50 disabled:cursor-not-allowed disabled:opacity-50 select-none rounded-pill",
  {
    variants: {
      variant: {
        primary:
          "bg-brand text-white hover:opacity-90 shadow-soft border-2 border-brand",
        secondary: "bg-bg-sub text-txt-main hover:bg-bg-hover",
        outline:
          "border-2 border-brand text-brand hover:bg-brand/5 bg-transparent",
        ghost: "text-txt-sec hover:bg-bg-sub hover:text-txt-main",
        teal: "bg-brand-success hover:opacity-90 text-inverse border-2 border-brand-success",
        dark: "bg-txt-main text-bg-main hover:opacity-90",
        "outline-white":
          "bg-transparent border border-white/30 hover:bg-white/10 text-inverse",
        // Special case: icon variant has specific dimensions
        icon: "rounded-full bg-bg-sub/50 backdrop-blur-md text-txt-main hover:bg-bg-sub border border-stroke shadow-soft p-0",
        brand:
          "bg-brand text-white hover:opacity-90 shadow-soft border-2 border-brand",
        link: "text-brand underline-offset-4 hover:underline bg-transparent p-0 h-auto rounded-none",
        back: "flex items-center justify-center transition-all disabled:opacity-50 hover:bg-surface-hover",
      },
      size: {
        sm: "px-lg h-9 text-upheader",
        md: "px-xl h-11 text-p",
        lg: "px-xxl h-14 text-h4 font-bold",
        icon: "w-11 h-11", // Specific size for icon variant
      },
      fullWidth: {
        true: "w-full",
      },
    },
    // Compounds for explicit color overrides handled via style/classes or additional variants
    // The previous implementation had dynamic color injection (bg-${color}).
    // CVA typically prefers static classes, but we can keep passing className for dynamic colors or add specific color variants if needed.
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type CommonProps = {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  href?: string | false;
  target?: string;
  color?: string; // Legacy prop support (handled via style or className if strictly needed, but better to move to variants)
};

// Merging props similar to before
type ButtonProps = Omit<HTMLMotionProps<"button">, "variant" | "size"> &
  CommonProps &
  ButtonVariantProps &
  (
    | {
        variant?: Exclude<ButtonVariantProps["variant"], "icon">;
      }
    | {
        variant: "icon";
        "aria-label": string;
      }
  );

export default function Button({
  children,
  className = "",
  icon,
  iconPosition = "left",
  loading = false,
  variant = "primary",
  size = "md",
  fullWidth = false,
  href,
  target,
  color,
  ...props
}: ButtonProps) {
  const router = useRouter();

  if (variant === "back") {
    // Keeping "back" variant logic separate if it has specific behavior,
    // or integrating it. The previous implementation had specific absolute positioning classes.
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        className={cn(
          "top-xl left-xl z-50 w-11 h-11 flex items-center justify-center transition-all disabled:opacity-50 hover:bg-surface-hover",
          className,
        )}
        onClick={href ? () => router.push(href) : () => router.back()}
        disabled={props.disabled}
        aria-label="Go back"
      >
        <ChevronLeft size={24} />
      </motion.button>
    );
  }

  // Handle legacy dynamic color override if present (mostly for outline/primary)
  const legacyColorOverlay = color
    ? variant === "outline"
      ? `border-${color} text-${color}`
      : `bg-${color} border-${color}`
    : "";

  // The 'icon' variant forced size styles in previous implementation.
  // In CVA, we can handle this via logic or compound variants.
  const effectiveSize =
    variant === "icon" ? "icon" : variant === "link" ? null : size;

  const combinedClasses = cn(
    buttonVariants({
      variant:
        variant === "icon"
          ? "icon"
          : (variant as ButtonVariantProps["variant"]),
      size: effectiveSize as ButtonVariantProps["size"],
      fullWidth,
    }),
    legacyColorOverlay,
    className,
  );

  const content = (
    <>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="shrink-0">{icon}</span>
          )}
          {children && <span>{children}</span>}
          {icon && iconPosition === "right" && (
            <span className="shrink-0">{icon}</span>
          )}
        </>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses} target={target}>
        {content}
      </Link>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={combinedClasses}
      disabled={loading || props.disabled}
      {...props}
    >
      {content}
    </motion.button>
  );
}
