"use client";

import React from "react";
import Link from "next/link";
import Card from "@/components/molecules/Card";
import Typography from "@/components/atoms/Typography";
import ImageWithFallback from "@/components/atoms/ImageWithFallback";

interface DestinationCardProps {
  title: string;
  subtitle?: string;
  image?: string | null;
  href: string;
  badge?: string;
  className?: string;
  imageClassName?: string;
  aspectRatio?: string;
}

export default function DestinationCard({
  title,
  subtitle,
  image,
  href,
  badge,
  className = "",
  imageClassName = "",
  aspectRatio = "aspect-4/3",
}: DestinationCardProps) {
  return (
    <Link href={href} className={`block ${className}`}>
      <Card
        className={`${aspectRatio} relative group border-0 shadow-sm overflow-hidden`}
      >
        <ImageWithFallback
          src={image || ""}
          alt={title}
          fill
          fallbackText={title.substring(0, 2).toUpperCase()}
          className={`object-cover group-hover:scale-105 transition-transform duration-500 ${imageClassName}`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-md">
          {subtitle && (
            <Typography variant="tiny" className="text-white/80 mb-0.5">
              {subtitle}
            </Typography>
          )}
          <Typography variant="h3" className="text-white truncate">
            {title}
          </Typography>

          {badge && (
            <div className="absolute top-md right-md bg-brand/90 text-white px-2 py-0.5 rounded-full shadow-sm">
              <Typography
                variant="micro"
                className="text-white font-bold leading-none"
              >
                {badge}
              </Typography>
            </div>
          )}
        </div>

        {/* Hover Glow / Bottom Bar */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-brand transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </Card>
    </Link>
  );
}
