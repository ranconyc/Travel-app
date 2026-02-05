import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-card overflow-hidden transition-all duration-300 relative group w-full",
  {
    variants: {
      variant: {
        surface: "bg-surface shadow-card",
        "surface-secondary": "bg-surface-secondary",
        image: "bg-surface-secondary", // Fallback if image fails
      },
      hover: {
        true: "hover:shadow-xl hover:-translate-y-1",
        false: "",
      },
      aspectRatio: {
        "aspect-[3.2/4]": "aspect-[3.2/4]",
        auto: "",
        square: "aspect-square",
        video: "aspect-video",
      },
    },
    defaultVariants: {
      variant: "surface",
      hover: true,
      aspectRatio: "auto",
    },
  },
);

interface CardProps extends Omit<
  VariantProps<typeof cardVariants>,
  "aspectRatio"
> {
  aspectRatio?: VariantProps<typeof cardVariants>["aspectRatio"] | string;
  children: React.ReactNode;
  className?: string;
  // Image Card Props
  image?: {
    src?: string;
    alt: string;
    priority?: boolean;
  };
  linkHref?: string;
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
  variant,
  className = "",
  hover,
  image,
  linkHref,
  aspectRatio,
  gradient = true,
  priority = false,
}: CardProps) {
  const isImageCard = variant === "image" || !!image;

  // Determine gradient class
  const gradientClass =
    gradient === false
      ? ""
      : typeof gradient === "string"
        ? gradient
        : "bg-gradient-to-t from-black/60 via-black/30 to-transparent";

  // If provided, aspectRatio prop might be a direct class string in legacy code,
  // or one of our keys. We'll try to use it as a variant if it matches,
  // otherwise explicit class merge.
  const ratioVariant =
    aspectRatio === "aspect-[3.2/4]"
      ? "aspect-[3.2/4]"
      : aspectRatio === "aspect-square"
        ? "square"
        : aspectRatio === "aspect-video"
          ? "video"
          : "auto";

  // Legacy aspect ratio support: if it was a raw string not in variants, append it to className
  const extraClasses =
    ratioVariant === "auto" && aspectRatio ? aspectRatio : "";

  const content = (
    <div
      className={cn(
        cardVariants({
          variant: isImageCard ? "image" : variant,
          hover,
          aspectRatio: isImageCard ? ratioVariant : undefined,
        }),
        isImageCard && extraClasses,
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
