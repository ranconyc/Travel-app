"use client";

import { useState } from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Image from "next/image";

const avatarVariants = cva("relative inline-block overflow-hidden bg-surface", {
  variants: {
    variant: {
      circle: "rounded-full",
      square: "rounded-lg",
    },
    showBorder: {
      true: "border-2 border-surface-secondary shadow-sm",
      false: "",
    },
  },
  defaultVariants: {
    variant: "circle",
    showBorder: true,
  },
});

export interface AvatarProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "variant">,
    VariantProps<typeof avatarVariants> {
  image?: string;
  alt: string;
  size?: number; // size in pixels
  initials?: string;
}

// cleaner, more flexible avatar component
export function Avatar({
  image,
  alt,
  size = 40, // default size
  className = "",
  style,
  variant,
  showBorder = false,
  initials,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Fallback hierarchy:
  // 1. Provided image (if not failed)
  // 2. Initials (if provided)
  // 3. Default placeholder
  const showImage = !!image && !hasError;
  const showInitials = !showImage && !!initials;

  return (
    <div
      style={{
        width: size,
        height: size,
        ...style,
      }}
      className={cn(avatarVariants({ variant, showBorder }), className)}
      {...props}
    >
      {showImage ? (
        <Image
          src={image!}
          alt={alt}
          fill
          className="object-cover"
          sizes={`${size}px`}
          onError={() => setHasError(true)}
        />
      ) : showInitials ? (
        <div
          className="flex h-full w-full items-center justify-center bg-brand text-white font-bold"
          style={{ fontSize: size * 0.4 }}
        >
          {initials!.toUpperCase().slice(0, 2)}
        </div>
      ) : (
        <Image
          src="/placeholder-avatar.png"
          alt={alt}
          fill
          className="object-cover opacity-50"
          sizes={`${size}px`}
        />
      )}
    </div>
  );
}
