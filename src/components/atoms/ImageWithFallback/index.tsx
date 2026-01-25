"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import Typography from "@/components/atoms/Typography";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  fallbackText?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  fallbackText,
  fill,
  className = "",
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  // If we have an error and no fallback source, show a stylized placeholder
  if (error && !fallbackSrc) {
    return (
      <div
        className={`w-full h-full relative flex items-center justify-center bg-surface-secondary/50 rounded-inherit ${className}`}
      >
        <Image
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop"
          alt="Placeholder"
          fill
          className="object-cover opacity-20 filter grayscale"
        />
        {fallbackText && (
          <Typography
            variant="h3"
            className="text-black/20 drop-shadow-sm relative z-10"
          >
            {fallbackText}
          </Typography>
        )}
      </div>
    );
  }

  return (
    <Image
      src={error && fallbackSrc ? fallbackSrc : src || ""}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
