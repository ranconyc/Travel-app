import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  variant?: "surface" | "surface-secondary" | "image";
  className?: string;
  hover?: boolean;
  // Image Card Props
  image?: {
    src?: string;
    alt: string;
    priority?: boolean;
  };
  linkHref?: string;
  aspectRatio?: string; // e.g. "aspect-[3.2/4]"
  gradient?: boolean | string;
  priority?: boolean;
}

function CardImage({
  src,
  alt,
  priority,
}: {
  src?: string;
  alt: string;
  priority?: boolean;
}) {
  const fallback =
    "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=2039";

  return (
    <Image
      src={src || fallback}
      alt={alt || "Card image"}
      fill
      sizes="(max-width: 768px) 80vw, 240px"
      className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
      priority={priority}
    />
  );
}

export default function Card({
  children,
  variant = "surface",
  className = "",
  hover = true,
  image,
  linkHref,
  aspectRatio = "aspect-[3.2/4]",
  gradient = true,
  priority = false,
}: CardProps) {
  const isImageCard = variant === "image" || !!image;
  const baseStyles =
    "rounded-card overflow-hidden transition-all duration-300 relative group w-full";

  const variantStyles = {
    surface: "bg-surface shadow-card",
    "surface-secondary": "bg-surface-secondary",
    image: "bg-surface-secondary", // Fallback if image fails
  };

  const hoverStyles = hover ? "hover:shadow-xl hover:-translate-y-1" : "";
  const ratioStyles = isImageCard ? aspectRatio : "";

  // Determine gradient class
  const gradientClass =
    gradient === false
      ? ""
      : typeof gradient === "string"
        ? gradient
        : "bg-gradient-to-t from-black/60 via-black/30 to-transparent";

  const content = (
    <div
      className={cn(
        baseStyles,
        !isImageCard && variantStyles[variant],
        hoverStyles,
        ratioStyles,
        className,
      )}
    >
      {isImageCard ? (
        <div className="relative h-full w-full">
          {image && (
            <CardImage
              src={image.src}
              alt={image.alt}
              priority={priority || image.priority}
            />
          )}

          {/* Gradient overlay */}
          {gradient && <div className={`absolute inset-0 ${gradientClass}`} />}

          {/* Content area */}
          <div className="absolute inset-0">{children}</div>
        </div>
      ) : (
        children
      )}
    </div>
  );

  return linkHref ? (
    <Link href={linkHref} className="block w-full">
      {content}
    </Link>
  ) : (
    content
  );
}
