"use client";

import { Loader2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "back"
  | "teal"
  | "dark"
  | "outline-white"
  | "icon"
  | "brand"
  | "link";

type ButtonSize = "sm" | "md" | "lg";

import { HTMLMotionProps } from "framer-motion";

type CommonProps = {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  href?: string | false;
  size?: ButtonSize;
  fullWidth?: boolean;
  target?: string;
  color?: "purple" | "blue" | "green" | "yellow" | "red" | "pink";
};

type ButtonProps = Omit<HTMLMotionProps<"button">, "variant"> &
  CommonProps &
  (
    | {
        variant?: Exclude<ButtonVariant, "icon">;
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
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        className={`top-xl left-xl z-50 w-11 h-11 flex items-center justify-center transition-all disabled:opacity-50 hover:bg-surface-hover ${className}`}
        onClick={href ? () => router.push(href) : () => router.back()}
        disabled={props.disabled}
        aria-label="Go back"
      >
        <ChevronLeft size={24} />
      </motion.button>
    );
  }

  const baseStyles =
    "inline-flex items-center justify-center gap-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-sm focus:ring-brand/50 disabled:cursor-not-allowed disabled:opacity-50 select-none";

  const sizeStyles = {
    sm: "px-lg h-9 text-upheader",
    md: "px-xl h-11 text-p",
    lg: "px-xxl h-14 text-h4 font-bold",
  };

  const variantStyles = {
    primary: `${color ? `bg-${color}` : "bg-brand"} text-inverse hover:opacity-90 shadow-soft border-2 ${color ? `border-${color}` : "border-brand"} rounded-pill`,
    secondary: "bg-bg-sub text-txt-main hover:bg-bg-hover rounded-pill",
    outline: `border-2 ${color ? `border-${color} text-${color}` : "border-brand text-brand"} hover:bg-brand/5 bg-transparent rounded-pill`,
    ghost: "text-txt-sec hover:bg-bg-sub hover:text-txt-main rounded-pill",
    teal: "bg-brand-success hover:opacity-90 text-inverse border-2 border-brand-success rounded-pill",
    dark: "bg-txt-main text-bg-main hover:opacity-90 rounded-pill",
    "outline-white":
      "bg-transparent border border-white/30 hover:bg-white/10 text-inverse rounded-pill",
    icon: "w-11 h-11 rounded-full bg-bg-sub/50 backdrop-blur-md text-txt-main flex items-center justify-center hover:bg-bg-sub border border-stroke shadow-soft p-0 transition-colors",
    brand:
      "bg-brand text-inverse hover:opacity-90 shadow-soft border-2 border-brand rounded-pill",
    link: "text-brand underline-offset-4 hover:underline bg-transparent p-0 h-auto",
  };

  const combinedClasses = [
    baseStyles,
    variant === "icon" || variant === "link" ? "" : sizeStyles[size],
    variantStyles[variant as keyof typeof variantStyles],
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");

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
