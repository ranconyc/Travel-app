"use client";

import { Loader2 } from "lucide-react";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  variant?: "primary" | "outline" | "ghost";
};

export default function Button({
  children,
  className,
  icon,
  iconPosition = "left",
  loading = false,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition active:scale-[.98]", 
  
       ${
         variant === "outline" &&
         "border border-gray-300 text-gray-800 hover:bg-gray-50"
       }  ${
        variant === "ghost" && "text-gray-600 hover:bg-gray-100"
      } ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {icon && iconPosition === "left" && icon}
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
}
