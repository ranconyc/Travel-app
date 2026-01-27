import React from "react";
import Image from "next/image";
import Link from "next/link";

type BaseCardProps = {
  children: React.ReactNode;
  image?: { 
    src?: string; 
    alt: string;
    priority?: boolean;
  };
  linkHref?: string;
  className?: string;
  aspectRatio?: string; // default: "aspect-[3.2/4]"
  gradient?: boolean | string; // default gradient or custom class
  priority?: boolean;
};

// Separate component just for the image logic
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

export default function BaseCard({
  children,
  image,
  linkHref,
  className = "",
  aspectRatio = "aspect-[3.2/4]",
  gradient = true,
  priority = false,
}: BaseCardProps) {
  // Determine gradient class
  const gradientClass = gradient === false 
    ? "" 
    : typeof gradient === "string" 
      ? gradient 
      : "bg-gradient-to-t from-black/60 via-black/30 to-transparent";

  const card = (
    <div
      className={`
        bg-white dark:bg-surface rounded-2xl overflow-hidden 
        shadow-lg hover:shadow-xl hover:shadow-2xl
        w-full relative ${aspectRatio} group transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1
        ${className}
      `}
    >
      <div className="relative h-full">
        {image && (
          <CardImage
            src={image.src}
            alt={image.alt}
            priority={priority}
          />
        )}

        {/* Gradient overlay */}
        {gradient && (
          <div className={`absolute inset-0 ${gradientClass}`} />
        )}

        {/* Content area */}
        <div className="absolute inset-0">{children}</div>
      </div>
    </div>
  );

  // If there's a link, wrap the card with <Link>, otherwise just render the card
  return linkHref ? (
    <Link href={linkHref} className="block">
      {card}
    </Link>
  ) : (
    card
  );
}
