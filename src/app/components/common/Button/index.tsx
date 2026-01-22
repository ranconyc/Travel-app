"use client";

import { Loader2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "back"
  | "teal"
  | "dark"
  | "outline-white"
  | "icon";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  variant?: ButtonVariant;
  href?: string | false;
  size?: ButtonSize;
  fullWidth?: boolean;
}

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
  ...props
}: ButtonProps) {
  const router = useRouter();

  if (variant === "back") {
    return (
      <button
        type="button"
        className={`text-app-text bg-transparent p-2 -ml-2 hover:bg-surface rounded-full transition-all active:scale-95 disabled:opacity-50 ${className}`}
        onClick={href ? () => router.push(href) : () => router.back()}
        disabled={props.disabled}
      >
        <ChevronLeft size={30} />
      </button>
    );
  }

  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium transition-all active:scale-[0.97] cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand/50 disabled:cursor-not-allowed disabled:opacity-50 select-none";

  const sizeStyles = {
    sm: "px-3 h-9 text-base",
    md: "px-4 h-11 text-base",
    lg: "px-6 h-14 text-base",
  };

  const variantStyles = {
    primary:
      "bg-brand text-white hover:opacity-90 shadow-sm border-2 border-brand rounded-md",
    secondary: "bg-surface text-app-text hover:bg-brand/10 rounded-md",
    outline:
      "border-2 border-brand text-brand hover:bg-brand/10 bg-transparent rounded-md",
    ghost: "text-secondary hover:bg-surface hover:text-app-text",
    teal: "bg-[#1A5F70] hover:bg-[#237082] text-white border border-[#2A7F90]",
    dark: "bg-gray-800 hover:bg-gray-700 text-white",
    "outline-white":
      "bg-transparent border border-white/20 hover:bg-white/10 text-white",
    // back: "bg-secondary/50 text-white rounded-full hover:bg-secondary/10", // Handled above
    icon: "bg-surface text-app-text rounded-full p-4 hover:bg-surface/10",
  };

  const combinedClasses = [
    baseStyles,
    sizeStyles[size],
    variantStyles[variant as keyof typeof variantStyles],
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");

  return (
    <button
      className={combinedClasses}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          {children && <span>{children}</span>}
          {icon && iconPosition === "right" && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </>
      )}
    </button>
  );
}
