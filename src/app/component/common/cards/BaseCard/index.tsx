import React from "react";
import Image from "next/image";
import Link from "next/link";

type BaseCardProps = {
  children: React.ReactNode;
  image?: { src?: string; alt?: string };
  linkHref?: string;
  className?: string;
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
  index?: number;
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
      className="object-cover"
      priority={priority}
    />
  );
}

export default function BaseCard({
  children,
  image,
  linkHref,
  priority,
  className,
}: BaseCardProps) {
  const card = (
    <div
      className={
        "bg-white rounded-2xl overflow-hidden min-w-[240px] h-[300px] mx-auto shadow " +
        (className ?? "")
      }
    >
      <div className="relative h-full">
        <CardImage
          src={image?.src}
          alt={image?.alt || "Card image"}
          priority={priority}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/55" />

        {/* Content area */}
        <div className="absolute inset-0 p-4">{children}</div>
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
