"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  variant?:
    | "primary"
    | "outline"
    | "ghost"
    | "back"
    | "teal"
    | "dark"
    | "outline-white";
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
  const router = useRouter();

  if (variant === "back") {
    return (
      <button
        className="bg-transparent p-0 hover:bg-gray-800"
        onClick={() => router.back()}
      >
        <ChevronLeft size={32} />
      </button>
    );
  }
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition active:scale-[.98] ${
        variant === "primary" && "bg-blue-500 hover:bg-blue-600 text-white"
      } ${
        variant === "outline" &&
        "border border-gray-300 text-gray-800 hover:bg-gray-50"
      } ${variant === "ghost" && "text-gray-600 hover:bg-gray-100"} ${
        variant === "teal" &&
        "bg-[#1A5F70] hover:bg-[#237082] text-white border border-[#2A7F90]"
      } ${variant === "dark" && "bg-gray-800 hover:bg-gray-700 text-white"} ${
        variant === "outline-white" &&
        "bg-transparent border border-white/20 hover:bg-white/10 text-white"
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
